import { DEFAULT_PING_INTERVAL_MS } from './config';
import { Subscription, WsMsg } from './utils/types';

type Callback = (msg: WsMsg) => void;

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
            return `notification:${subscription.user.toLowerCase()}`;
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
        default:
            return undefined;
    }
}

export class WebsocketManager {
    private ws: WebSocket;
    private wsReady: boolean = false;
    private subscriptionIdCounter: number = 0;
    private queuedSubscriptions: Array<{
        subscription: Subscription;
        active: ActiveSubscription;
    }> = [];
    private activeSubscriptions: Record<string, ActiveSubscription[]> = {};
    private pingInterval: number | null = null;
    private stopped: boolean = false;
    private isDebug: boolean;
    constructor(baseUrl: string, isDebug: boolean = false) {
        this.isDebug = isDebug;

        const wsUrl = 'wss' + baseUrl.slice(baseUrl.indexOf(':')) + '/ws';
        this.ws = new WebSocket(wsUrl);

        this.ws.addEventListener('open', this.onOpen);
        this.ws.addEventListener('message', this.onMessage);
        this.ws.addEventListener('close', this.onClose);
    }

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

        this.pingInterval = setInterval(() => {
            if (this.stopped || this.ws.readyState !== WebSocket.OPEN) return;
            this.log('sending ping');
            this.ws.send(JSON.stringify({ method: 'ping' }));
        }, DEFAULT_PING_INTERVAL_MS);
    };

    private onMessage = (event: MessageEvent) => {
        const message = event.data;
        this.log('onMessage', message);
        if (message === 'Websocket connection established.') {
            this.log('Websocket connection established.');
            return;
        }
        let wsMsg: WsMsg;
        try {
            wsMsg = JSON.parse(message);
        } catch (e) {
            this.log('Invalid JSON:', message);
            return;
        }
        const identifier = wsMsgToIdentifier(wsMsg);
        if (identifier === 'pong') {
            this.log('Pong response received.');
            return;
        }
        if (!identifier) {
            this.log('Unknown or empty message:', message);
            return;
        }
        const activeSubs = this.activeSubscriptions[identifier] || [];
        if (activeSubs.length === 0) {
            this.log(
                'Websocket message from an unexpected subscription:',
                message,
                identifier,
            );
            return;
        }
        for (const active of activeSubs) {
            active.callback(wsMsg);
        }
    };

    private onClose = () => {
        this.log('onClose');
        this.wsReady = false;
        if (this.pingInterval !== null) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
            this.log('stopped ping');
        }
    };

    stop() {
        this.log('stopping');
        this.stopped = true;
        if (this.pingInterval !== null) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
            this.log('stopped ping');
        }
        this.ws.close();
    }

    subscribe(
        subscription: Subscription,
        callback: Callback,
        subscriptionId?: number,
    ): number {
        if (subscriptionId == null) {
            this.subscriptionIdCounter += 1;
            subscriptionId = this.subscriptionIdCounter;
        }
        if (!this.wsReady) {
            this.log('enqueueing subscription', subscription, subscriptionId);
            this.queuedSubscriptions.push({
                subscription,
                active: { callback, subscriptionId },
            });
        } else {
            this.log('subscribing', subscription, subscriptionId);
            const identifier = subscriptionToIdentifier(subscription);
            if (identifier === 'userEvents' || identifier === 'orderUpdates') {
                if (
                    this.activeSubscriptions[identifier] &&
                    this.activeSubscriptions[identifier].length !== 0
                ) {
                    throw new Error(
                        `Cannot subscribe to ${identifier} multiple times`,
                    );
                }
            }
            if (!this.activeSubscriptions[identifier]) {
                this.activeSubscriptions[identifier] = [];
            }
            this.activeSubscriptions[identifier].push({
                callback,
                subscriptionId,
            });
            this.ws.send(JSON.stringify({ method: 'subscribe', subscription }));
        }
        return subscriptionId;
    }

    unsubscribe(subscription: Subscription, subscriptionId: number): boolean {
        this.log('unsubscribing', subscription, subscriptionId);
        if (!this.wsReady) {
            throw new Error("Can't unsubscribe before websocket connected");
        }
        const identifier = subscriptionToIdentifier(subscription);
        const activeSubs = this.activeSubscriptions[identifier] || [];
        const newActiveSubs = activeSubs.filter(
            (x) => x.subscriptionId !== subscriptionId,
        );
        if (newActiveSubs.length === 0) {
            this.ws.send(
                JSON.stringify({ method: 'unsubscribe', subscription }),
            );
        }
        this.activeSubscriptions[identifier] = newActiveSubs;
        return activeSubs.length !== newActiveSubs.length;
    }

    isWsReady() {
        return this.wsReady;
    }
}
