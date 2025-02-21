import {create} from 'zustand';
import type { OrderRowIF } from '~/routes/trade/orderbook/orderbook';

interface OrderBookStore {
    buys: OrderRowIF[];
    sells: OrderRowIF[];
    orderBook: OrderRowIF[];
    setOrderBook: (buys: OrderRowIF[], sells: OrderRowIF[]) => void;
}

export const useOrderBookStore = create<OrderBookStore>((set) => ({
    orderBook: [],
    buys: [],
    sells: [],
    setOrderBook: (buys: OrderRowIF[], sells: OrderRowIF[]) => set({ buys, sells }),
}));