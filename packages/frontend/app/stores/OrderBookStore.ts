import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
    OrderBookTradeIF,
    OrderBookRowIF,
    OrderBookMode,
    OrderBookLiqIF,
    OrderRowResolutionIF,
} from '~/utils/orderbook/OrderBookIFs';
import { TableState } from '~/utils/CommonIFs';

interface OrderBookStore {
    buys: OrderBookRowIF[];
    sells: OrderBookRowIF[];
    setHrLiqBuys: (hrLiqBuys: OrderBookLiqIF[]) => void;
    setHrLiqSells: (hrLiqSells: OrderBookLiqIF[]) => void;
    selectedResolution: OrderRowResolutionIF | null;
    selectedMode: OrderBookMode;
    orderBook: OrderBookRowIF[];
    orderBookState: TableState;
    setOrderBook: (
        buys: OrderBookRowIF[],
        sells: OrderBookRowIF[],
        setMid?: boolean,
    ) => void;
    setSelectedResolution: (resolution: OrderRowResolutionIF | null) => void;
    setSelectedMode: (mode: OrderBookMode) => void;
    setOrderBookState: (state: TableState) => void;
    trades: OrderBookTradeIF[];
    setTrades: (trades: OrderBookTradeIF[]) => void;
    setLiqBuys: (liqBuys: OrderBookLiqIF[]) => void;
    setLiqSells: (liqSells: OrderBookLiqIF[]) => void;
    orderCount: number;
    setOrderCount: (orderCount: number) => void;
    activeOrderTab: string;
    setActiveOrderTab: (activeOrderTab: string) => void;
    resolutionPairs: Record<string, OrderRowResolutionIF>;
    addToResolutionPair: (
        symbol: string,
        resolutionPair: OrderRowResolutionIF,
    ) => void;
    midPrice: number | null;
    setMidPrice: (midPrice: number) => void;
    usualResolution: OrderRowResolutionIF | null;
    setUsualResolution: (resolution: OrderRowResolutionIF) => void;
    hrBuys: OrderBookRowIF[];
    hrSells: OrderBookRowIF[];
    setHrBuys: (hrBuys: OrderBookRowIF[]) => void;
    setHrSells: (hrSells: OrderBookRowIF[]) => void;
    inpBuys: OrderBookRowIF[];
    inpSells: OrderBookRowIF[];
    setInpBuys: (inpBuys: OrderBookRowIF[]) => void;
    setInpSells: (inpSells: OrderBookRowIF[]) => void;
    liqBuys: OrderBookLiqIF[];
    liqSells: OrderBookLiqIF[];
    hrLiqBuys: OrderBookLiqIF[];
    hrLiqSells: OrderBookLiqIF[];
}

export const useOrderBookStore = create<OrderBookStore>()(
    persist(
        (set) => ({
            orderBook: [],
            buys: [],
            sells: [],
            selectedResolution: null,
            selectedMode: 'symbol',
            orderBookState: TableState.LOADING,
            trades: [],
            setOrderBook: (
                buys: OrderBookRowIF[],
                sells: OrderBookRowIF[],
                setMid?: boolean,
            ) => {
                if (setMid) {
                    set({
                        buys: buys,
                        sells: sells,
                        midPrice: (buys[0].px + sells[0].px) / 2,
                    });
                } else {
                    set({
                        buys,
                        sells,
                    });
                }
            },
            setSelectedResolution: (
                selectedResolution: OrderRowResolutionIF | null,
            ) => set({ selectedResolution }),
            setSelectedMode: (selectedMode: OrderBookMode) =>
                set({ selectedMode }),
            setOrderBookState: (orderBookState: TableState) =>
                set({ orderBookState }),
            setTrades: (trades: OrderBookTradeIF[]) => set({ trades }),
            orderCount: 9,
            setOrderCount: (orderCount: number) => set({ orderCount }),
            activeOrderTab: 'Book',
            setActiveOrderTab: (activeOrderTab: string) =>
                set({ activeOrderTab }),
            addToResolutionPair: (
                symbol: string,
                resolutionPair: OrderRowResolutionIF,
            ) =>
                set((state) => ({
                    resolutionPairs: {
                        ...state.resolutionPairs,
                        [symbol]: resolutionPair,
                    },
                })),
            resolutionPairs: {},
            midPrice: null,
            setMidPrice: (midPrice: number) => set({ midPrice }),
            usualResolution: null,
            setUsualResolution: (resolution: OrderRowResolutionIF) =>
                set({ usualResolution: resolution }),
            hrBuys: [],
            hrSells: [],
            setHrBuys: (hrBuys: OrderBookRowIF[]) => set({ hrBuys }),
            setHrSells: (hrSells: OrderBookRowIF[]) => set({ hrSells }),
            inpBuys: [],
            inpSells: [],
            setInpBuys: (inpBuys: OrderBookRowIF[]) => set({ inpBuys }),
            setInpSells: (inpSells: OrderBookRowIF[]) => set({ inpSells }),
            liqBuys: [],
            liqSells: [],
            setLiqBuys: (liqBuys: OrderBookLiqIF[]) => set({ liqBuys }),
            setLiqSells: (liqSells: OrderBookLiqIF[]) => set({ liqSells }),
            hrLiqBuys: [],
            hrLiqSells: [],
            setHrLiqBuys: (hrLiqBuys: OrderBookLiqIF[]) => set({ hrLiqBuys }),
            setHrLiqSells: (hrLiqSells: OrderBookLiqIF[]) =>
                set({ hrLiqSells }),
        }),
        {
            name: 'ORDERBOOK',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                resolutionPairs: state.resolutionPairs,
            }),
        },
    ),
);
