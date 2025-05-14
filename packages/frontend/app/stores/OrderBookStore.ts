import { create } from 'zustand';
import type {
    OrderBookTradeIF,
    OrderBookRowIF,
} from '~/utils/orderbook/OrderBookIFs';

interface OrderBookStore {
    buys: OrderBookRowIF[];
    sells: OrderBookRowIF[];
    orderBook: OrderBookRowIF[];
    setOrderBook: (buys: OrderBookRowIF[], sells: OrderBookRowIF[]) => void;
    trades: OrderBookTradeIF[];
    setTrades: (trades: OrderBookTradeIF[]) => void;
}

export const useOrderBookStore = create<OrderBookStore>((set) => ({
    orderBook: [],
    buys: [],
    sells: [],
    trades: [],
    setOrderBook: (buys: OrderBookRowIF[], sells: OrderBookRowIF[]) =>
        set({ buys, sells }),
    setTrades: (trades: OrderBookTradeIF[]) => set({ trades }),
}));
