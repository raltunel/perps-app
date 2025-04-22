/// <reference lib="webworker" />

import type {
    L2BookDataIF,
    OrderBookRowIF,
} from '~/utils/orderbook/OrderBookIFs';
import { processOrderBookMessage } from '../processOrderBook';

export type OrderBookInput = string;
export type OrderBookOutput = {
    sells: OrderBookRowIF[];
    buys: OrderBookRowIF[];
};

self.onmessage = function (event: MessageEvent<OrderBookInput>) {
    try {
        const { data } = JSON.parse(event.data);
        const result = processOrderBookMessage(data as L2BookDataIF);
        self.postMessage(result);
    } catch (error) {
        console.error('Error parsing JSON in orderbook.worker:', error);
        self.postMessage({ error: (error as Error).message });
    }
};
