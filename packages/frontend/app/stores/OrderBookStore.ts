import { create } from 'zustand';
import type {
    OrderBookTradeIF,
    OrderBookRowIF,
    OrderBookMode,
    OrderRowResolutionIF,
} from '~/utils/orderbook/OrderBookIFs';
import { TableState } from '~/utils/CommonIFs';

interface OrderBookStore {
    buys: OrderBookRowIF[];
    sells: OrderBookRowIF[];
    selectedResolution: OrderRowResolutionIF | null;
    selectedMode: OrderBookMode;
    orderBookState: TableState;
    setOrderBook: (buys: OrderBookRowIF[], sells: OrderBookRowIF[]) => void;
    setSelectedResolution: (resolution: OrderRowResolutionIF | null) => void;
    setSelectedMode: (mode: OrderBookMode) => void;
    setOrderBookState: (state: TableState) => void;
    trades: OrderBookTradeIF[];
    setTrades: (trades: OrderBookTradeIF[]) => void;
}

export const useOrderBookStore = create<OrderBookStore>((set) => ({
    buys: [],
    sells: [],
    selectedResolution: null,
    selectedMode: 'symbol',
    orderBookState: TableState.LOADING,
    trades: [],
    setOrderBook: (buys: OrderBookRowIF[], sells: OrderBookRowIF[]) =>
        set({ buys, sells }),
    setSelectedResolution: (selectedResolution: OrderRowResolutionIF | null) =>
        set({ selectedResolution }),
    setSelectedMode: (selectedMode: OrderBookMode) => set({ selectedMode }),
    setOrderBookState: (orderBookState: TableState) => set({ orderBookState }),
    setTrades: (trades: OrderBookTradeIF[]) => set({ trades }),
}));
