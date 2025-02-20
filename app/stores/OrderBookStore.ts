import {create} from 'zustand';
import type { OrderRowIF } from '~/routes/trade/orderbook/orderbook';

interface OrderBookStore {
    orderBook: OrderRowIF[];
    setOrderBook: (orderBook: OrderRowIF[]) => void;
}

export const useOrderBookStore = create<OrderBookStore>((set) => ({
    orderBook: [],
    setOrderBook: (orderBook: OrderRowIF[]) => set({ orderBook }),
}));