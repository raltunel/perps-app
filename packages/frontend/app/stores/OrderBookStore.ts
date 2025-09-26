import { create } from 'zustand';
import { TableState } from '~/utils/CommonIFs';
import type {
    OrderBookTradeIF,
    OrderBookRowIF,
    OrderRowResolutionIF,
} from '~/utils/orderbook/OrderBookIFs';

interface OrderBookStore {
    buys: OrderBookRowIF[];
    sells: OrderBookRowIF[];
    orderBook: OrderBookRowIF[];
    setOrderBook: (buys: OrderBookRowIF[], sells: OrderBookRowIF[]) => void;
    trades: OrderBookTradeIF[];
    setTrades: (trades: OrderBookTradeIF[]) => void;
    selectedResolution: OrderRowResolutionIF | null;
    setSelectedResolution: (resolution: OrderRowResolutionIF | null) => void;
    orderBookState: TableState;
    setOrderBookState: (state: TableState) => void;
}

export const useOrderBookStore = create<OrderBookStore>((set) => ({
    orderBook: [],
    buys: [],
    sells: [],
    trades: [],
    setOrderBook: (buys: OrderBookRowIF[], sells: OrderBookRowIF[]) =>
        set({ buys, sells }),
    setTrades: (trades: OrderBookTradeIF[]) => set({ trades }),
    selectedResolution: null,
    setSelectedResolution: (resolution: OrderRowResolutionIF | null) =>
        set({ selectedResolution: resolution }),
    orderBookState: TableState.LOADING,
    setOrderBookState: (state: TableState) => set({ orderBookState: state }),
}));
