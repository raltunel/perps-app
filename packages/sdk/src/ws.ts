import { DEFAULT_PING_INTERVAL_MS } from './config';
import { createJsonParserWorker } from './utils/workers';
import type { Subscription, WsMsg } from './utils/types';

export type Callback = (msg: WsMsg) => void;

interface ActiveSubscription {
    callback: Callback;
    subscriptionId: number;
}

function subscriptionToIdentifier(subscription: Subscription): string {
    switch (subscription.type) {
        case 'allMids':
            return 'allMids';
        case 'l2Book':
            return `l2Book:${subscription.coin.toLowerCase()}`;
        case 'trades':
            return `trades:${subscription.coin.toLowerCase()}`;
        case 'userEvents':
            return 'userEvents';
        case 'userFills':
            return `userFills:${subscription.user.toLowerCase()}`;
        case 'candle':
            return `candle:${subscription.coin.toLowerCase()},${subscription.interval}`;
        case 'orderUpdates':
            return 'orderUpdates';
        case 'userFundings':
            return `userFundings:${subscription.user.toLowerCase()}`;
        case 'userNonFundingLedgerUpdates':
            return `userNonFundingLedgerUpdates:${subscription.user.toLowerCase()}`;
        case 'webData2':
            return `webData2:${subscription.user.toLowerCase()}`;
        case 'notification':
            return `notification`;
        case 'userHistoricalOrders':
            return `userHistoricalOrders:${subscription.user.toLowerCase()}`;
        default:
            throw new Error('Unknown subscription type');
    }
}

function wsMsgToIdentifier(wsMsg: WsMsg): string | undefined {
    switch (wsMsg.channel) {
        case 'pong':
            return 'pong';
        case 'allMids':
            return 'allMids';
        case 'l2Book':
            return `l2Book:${wsMsg.data.coin.toLowerCase()}`;
        case 'trades':
            const trades = wsMsg.data;
            if (!Array.isArray(trades) || trades.length === 0) return undefined;
            return `trades:${trades[0].coin.toLowerCase()}`;
        case 'user':
            return 'userEvents';
        case 'userFills':
            return `userFills:${wsMsg.data.user.toLowerCase()}`;
        case 'candle':
            return `candle:${wsMsg.data.s?.toLowerCase?.() ?? wsMsg.data.coin?.toLowerCase?.()},${wsMsg.data.i ?? wsMsg.data.interval}`;
        case 'orderUpdates':
            return 'orderUpdates';
        case 'userFundings':
            return `userFundings:${wsMsg.data.user.toLowerCase()}`;
        case 'userNonFundingLedgerUpdates':
            return `userNonFundingLedgerUpdates:${wsMsg.data.user.toLowerCase()}`;
        case 'webData2':
            return `webData2:${wsMsg.data.user.toLowerCase()}`;
        case 'notification':
            return 'notification';
        case 'userHistoricalOrders':
            return `userHistoricalOrders:${wsMsg.data.user.toLowerCase()}`;
        default:
            return undefined;
    }
}

export class WebsocketManager {
    private ws!: WebSocket;
    private wsReady: boolean = false;
    private subscriptionIdCounter: number = 0;
    private queuedSubscriptions: Array<{
        subscription: Subscription;
        active: ActiveSubscription;
    }> = [];
    private activeSubscriptions: Record<string, ActiveSubscription[]> = {};
    private allSubscriptions: Record<
        number,
        { subscription: Subscription; callback: Callback }
    > = {};
    private pingInterval: number | null = null;
    private stopped: boolean = false;
    private isDebug: boolean;
    private baseUrl: string;
    private workers: Worker[] = [];
    private customWorkers: Record<string, Worker> = {};
    private nextWorkerIndex: number = 0;
    private numWorkers: number;
    private jsonParserWorkerBlobUrl: string | null = null;

    constructor(
        baseUrl: string,
        isDebug: boolean = false,
        numWorkers: number = 4,
        customWorkers?: Record<string, Worker>,
    ) {
        this.isDebug = isDebug;
        this.baseUrl = baseUrl;
        this.numWorkers = numWorkers;
        this.customWorkers = customWorkers || {};

        for (const [channel, worker] of Object.entries(this.customWorkers)) {
            worker.onmessage = this.handleCustomWorkerMessage;
        }

        this.initializeWorkers();
        this.connect();
    }

    private initializeWorkers() {
        if (this.numWorkers === 0) {
            this.log(
                'No workers requested, skipping initialization. JSON parsing will occur on the main thread.',
            );
            return;
        }

        this.workers.forEach((worker) => worker.terminate());
        this.workers = [];

        if (this.jsonParserWorkerBlobUrl) {
            URL.revokeObjectURL(this.jsonParserWorkerBlobUrl);
        }
        this.jsonParserWorkerBlobUrl = createJsonParserWorker();

        this.log(`Initializing ${this.numWorkers} JSON parsing worker(s)`);
        for (let i = 0; i < this.numWorkers; i++) {
            try {
                const worker = new Worker(this.jsonParserWorkerBlobUrl);
                worker.onmessage = (event: MessageEvent) =>
                    this.handleWorkerMessage(event, i);
                worker.onerror = (event) => {
                    this.log(`Worker ${i} error: ${event.message}`, event);
                };
                this.workers.push(worker);
            } catch (error) {
                this.log(`Failed to create worker ${i}:`, error);
            }
        }
        if (this.workers.length < this.numWorkers) {
            this.log(
                `Could only initialize ${this.workers.length} workers instead of the requested ${this.numWorkers}.`,
            );
            this.numWorkers = this.workers.length;
        }
        this.nextWorkerIndex = 0;
    }

    private connect = () => {
        const wsUrl =
            'wss' + this.baseUrl.slice(this.baseUrl.indexOf(':')) + '/ws';
        this.log('Connecting to', wsUrl);
        this.ws = new WebSocket(wsUrl);
        this.wsReady = false;
        this.stopped = false;

        this.ws.removeEventListener('open', this.onOpen);
        this.ws.removeEventListener('message', this.onMessage);
        this.ws.removeEventListener('close', this.onClose);

        this.ws.addEventListener('open', this.onOpen);
        this.ws.addEventListener('message', this.onMessage);
        this.ws.addEventListener('close', this.onClose);

        // make sure workers are ready before connecting
        if (this.workers.length === 0 && this.numWorkers > 0) {
            this.log('Workers not initialized, attempting re-initialization.');
            this.initializeWorkers();
            if (this.workers.length === 0) {
                this.log(
                    'Worker re-initialization failed. Proceeding without workers.',
                );
            }
        }
    };

    private log = (...args: any[]) => {
        if (this.isDebug) {
            console.log(...args);
        }
    };

    private onOpen = () => {
        this.log('onOpen');
        this.wsReady = true;
        // send queued subs
        for (const { subscription, active } of this.queuedSubscriptions) {
            this.subscribe(
                subscription,
                active.callback,
                active.subscriptionId,
            );
        }
        this.queuedSubscriptions = [];

        if (!this.stopped && this.pingInterval === null) {
            // @ts-ignore
            this.pingInterval = setInterval(() => {
                if (
                    this.stopped ||
                    !this.ws ||
                    this.ws.readyState !== WebSocket.OPEN
                )
                    return;
                this.log('sending ping');
                this.ws.send(JSON.stringify({ method: 'ping' }));
            }, DEFAULT_PING_INTERVAL_MS);
            this.log('started ping');
        }
    };

    private extractChannelFromPayload(raw: string): string {
        const match = raw.match(/"channel"\s*:\s*"([^"]+)"/);
        return match ? match[1] : '';
    }

    private handleParsedMessage = (wsMsg: WsMsg, originalMessage: string) => {
        const identifier = wsMsgToIdentifier(wsMsg);
        if (identifier === 'pong') {
            this.log('Pong response received.');
            return;
        }
        if (!identifier) {
            this.log(
                'Unknown or empty message after parsing:',
                wsMsg,
                'Original:',
                originalMessage,
            );
            return;
        }
        const activeSubs = this.activeSubscriptions[identifier] || [];
        if (activeSubs.length === 0) {
            this.log(
                'Websocket message from an unexpected subscription:',
                wsMsg,
                identifier,
                'Original:',
                originalMessage,
            );
            return;
        }
        for (const active of activeSubs) {
            active.callback(wsMsg);
        }
    };

    private onMessage = (event: MessageEvent) => {
        console.log('activeSubscriptions', this.activeSubscriptions);
        const message = event.data;
        const channel = this.extractChannelFromPayload(message);

        if (channel in this.customWorkers) {
            console.log('posting message to custom worker', channel);
            this.customWorkers[channel].postMessage(message);
            return;
        }

        this.log('onMessage Raw:', message);
        if (message === 'Websocket connection established.') {
            this.log('Websocket connection established.');
            return;
        }

        if (this.workers.length > 0) {
            const worker = this.workers[this.nextWorkerIndex];
            worker.postMessage(message);
            this.nextWorkerIndex = (this.nextWorkerIndex + 1) % this.numWorkers;
        } else {
            // parse on main thread if no workers initialized
            this.log('No workers available, parsing JSON on main thread.');
            let wsMsg: WsMsg;
            try {
                wsMsg = JSON.parse(message);
                this.handleParsedMessage(wsMsg, message);
            } catch (e) {
                this.log('Invalid JSON (main thread):', message, e);
            }
        }
    };

    private handleWorkerMessage = (
        event: MessageEvent,
        workerIndex: number,
    ) => {
        const { success, data, error, originalMessage } = event.data;
        if (success) {
            this.log(`Parsed by worker ${workerIndex}:`, data);
            this.handleParsedMessage(data as WsMsg, originalMessage);
        } else {
            this.log(
                `Worker ${workerIndex} parsing error:`,
                error,
                'Original:',
                originalMessage,
            );
        }
    };

    private handleCustomWorkerMessage = (event: MessageEvent) => {
        console.log('handleCustomWorkerMessage', event);
        const { channel, data } = event.data;
        const activeSubs = this.activeSubscriptions[channel] || [];
        for (const active of activeSubs) {
            active.callback(data);
        }
    };

    private onClose = () => {
        this.log('onClose');
        this.wsReady = false;
        if (this.pingInterval !== null && !this.stopped) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
            this.log('stopped ping due to close');
        }
    };

    public stop() {
        this.log('stopping');
        this.stopped = true;
        if (this.pingInterval !== null) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
            this.log('stopped ping');
        }
        if (this.ws) {
            this.ws.removeEventListener('open', this.onOpen);
            this.ws.removeEventListener('message', this.onMessage);
            this.ws.removeEventListener('close', this.onClose);
            if (
                this.ws.readyState === WebSocket.OPEN ||
                this.ws.readyState === WebSocket.CONNECTING
            ) {
                this.ws.close();
            }
            this.log('WebSocket connection closed.');
        }
        this.wsReady = false;
        this.queuedSubscriptions = [];
        this.activeSubscriptions = {};

        if (this.numWorkers === 0) {
            this.log('No workers, skipping worker termination.');
            return;
        }

        this.log(`Terminating ${this.workers.length} worker(s)`);
        this.workers.forEach((worker) => worker.terminate());
        this.workers = [];
        this.nextWorkerIndex = 0;
        if (this.jsonParserWorkerBlobUrl) {
            URL.revokeObjectURL(this.jsonParserWorkerBlobUrl);
            this.jsonParserWorkerBlobUrl = null;
        }
    }

    public setBaseUrl(newBaseUrl: string) {
        this.log('Setting new base URL:', newBaseUrl);
        if (this.baseUrl === newBaseUrl) {
            this.log(
                'New base URL is the same as the current one. No action taken.',
            );
            return;
        }

        const oldSubscriptions = { ...this.allSubscriptions };

        this.stop();

        this.queuedSubscriptions = [];
        for (const _subId in oldSubscriptions) {
            const subId = Number(_subId);
            const { subscription, callback } = oldSubscriptions[subId];
            this.queuedSubscriptions.push({
                subscription,
                active: { callback, subscriptionId: subId },
            });
        }
        this.allSubscriptions = {};
        this.activeSubscriptions = {};

        this.baseUrl = newBaseUrl;

        this.connect();
    }

    public subscribe(
        subscription: Subscription,
        callback: Callback,
        subscriptionId?: number,
    ): number {
        if (subscriptionId == null) {
            this.subscriptionIdCounter += 1;
            subscriptionId = this.subscriptionIdCounter;
        } else {
            if (this.activeSubscriptions[subscriptionId]) {
                this.log(
                    `Subscription ID ${subscriptionId} already exists, replacing callback.`,
                );
                this.allSubscriptions[subscriptionId].callback = callback;
                return subscriptionId;
            }
        }

        this.allSubscriptions[subscriptionId] = { subscription, callback };

        if (!this.wsReady || this.ws.readyState !== WebSocket.OPEN) {
            this.log('enqueueing subscription', subscription, subscriptionId);
            if (
                !this.queuedSubscriptions.some(
                    (q) => q.active.subscriptionId === subscriptionId,
                )
            ) {
                this.queuedSubscriptions.push({
                    subscription,
                    active: { callback, subscriptionId },
                });
            }
        } else {
            this.log('subscribing', subscription, subscriptionId);
            const identifier = subscriptionToIdentifier(subscription);

            if (identifier === 'userEvents' || identifier === 'orderUpdates') {
                if (
                    this.activeSubscriptions[identifier] &&
                    this.activeSubscriptions[identifier].length > 0 &&
                    !this.activeSubscriptions[identifier].some(
                        (s) => s.subscriptionId === subscriptionId,
                    )
                ) {
                    throw new Error(
                        `Cannot subscribe to ${identifier} multiple times with different IDs`,
                    );
                }
            }

            if (!this.activeSubscriptions[identifier]) {
                this.activeSubscriptions[identifier] = [];
            }
            if (
                !this.activeSubscriptions[identifier].some(
                    (s) => s.subscriptionId === subscriptionId,
                )
            ) {
                this.activeSubscriptions[identifier].push({
                    callback,
                    subscriptionId,
                });
                this.ws.send(
                    JSON.stringify({ method: 'subscribe', subscription }),
                );
            }
        }
        return subscriptionId;
    }

    public unsubscribe(
        subscription: Subscription,
        subscriptionId: number,
    ): boolean {
        this.log('unsubscribing', subscription, subscriptionId);

        const wasTracked = this.allSubscriptions[subscriptionId] !== undefined;
        delete this.allSubscriptions[subscriptionId];

        if (!this.wsReady || this.ws.readyState !== WebSocket.OPEN) {
            const initialQueueLength = this.queuedSubscriptions.length;
            this.queuedSubscriptions = this.queuedSubscriptions.filter(
                (q) => q.active.subscriptionId !== subscriptionId,
            );
            return (
                wasTracked ||
                this.queuedSubscriptions.length < initialQueueLength
            );
        }

        const identifier = subscriptionToIdentifier(subscription);
        const activeSubs = this.activeSubscriptions[identifier] || [];
        const initialActiveLength = activeSubs.length;
        const newActiveSubs = activeSubs.filter(
            (x) => x.subscriptionId !== subscriptionId,
        );

        const removedFromActive = newActiveSubs.length < initialActiveLength;

        if (removedFromActive) {
            this.activeSubscriptions[identifier] = newActiveSubs;
            if (newActiveSubs.length === 0) {
                this.log('Sending unsubscribe message for', identifier);
                this.ws.send(
                    JSON.stringify({ method: 'unsubscribe', subscription }),
                );
            }
        }

        return removedFromActive || wasTracked;
    }

    public isWsReady() {
        return this.wsReady;
    }
}
