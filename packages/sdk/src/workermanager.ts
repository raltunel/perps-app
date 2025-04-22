import { DEFAULT_PING_INTERVAL_MS } from './config';
import type { Subscription, WsMsg } from './utils/types';

export class WorkerManager {
    private workers: Map<string, Worker> = new Map();
    private callback: (msg: WsMsg) => void;
    private DEFAULT_WORKER = 'jsonParser';

    constructor(callback: (msg: WsMsg) => void) {
        this.workers = new Map();
        this.callback = callback;

        const jsonParserWorker = new Worker(
            new URL('./workers/jsonParser.worker.ts', import.meta.url),
            { type: 'module' },
        );
        jsonParserWorker.onmessage = (event) => {
            this.callback(event.data);
        };
        this.workers.set(this.DEFAULT_WORKER, jsonParserWorker);
    }

    private extractChannelFromPayload = (raw: string): string => {
        const match = raw.match(/"channel"\s*:\s*"([^"]+)"/);
        return match ? match[1] : '';
    };

    public initWorker = (type: string) => {
        if (this.workers.has(type)) {
            return;
        }

        const worker = new Worker(type);
        this.workers.set(type, worker);
    };

    public registerWorker = (type: string, worker: Worker) => {
        if (this.workers.has(type)) {
            return;
        }
        worker.onmessage = (event) => {
            this.callback(event.data);
        };
        this.workers.set(type, worker);
    };

    public getWorker = (type: string) => {
        if (this.workers.has(type)) {
            return this.workers.get(type);
        }
        return this.workers.get(this.DEFAULT_WORKER);
    };

    public processMsg = (msg: string) => {
        const channel = this.extractChannelFromPayload(msg);
        const worker = this.getWorker(channel);
        if (worker) {
            worker.postMessage(msg);
        }
    };
}
