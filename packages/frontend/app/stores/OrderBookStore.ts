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
    highResBuys: OrderBookRowIF[];
    highResSells: OrderBookRowIF[];
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

const interpolateOrderBookData = (
    orders: OrderBookRowIF[],
    subRanges: number = 3,
): OrderBookRowIF[] => {
    if (orders.length === 0) return [];

    const highResOrders: OrderBookRowIF[] = [orders[0]];

    for (let i = 1; i < orders.length; i++) {
        const pxDiff = orders[i].px - orders[i - 1].px;
        let ratioDiff = 0;
        if (orders[i].ratio && orders[i - 1].ratio) {
            const r2 = orders[i].ratio;
            const r1 = orders[i - 1].ratio;
            ratioDiff = (r2 || 0) - (r1 || 0);
        }

        let usedSz = 0;

        for (let j = 0; j < subRanges; j++) {
            let midSz = 0;
            if (j === subRanges - 1) {
                midSz = orders[i].sz - usedSz;
            } else {
                midSz = ((orders[i].sz - usedSz) * Math.random()) / 2;
                usedSz += midSz;
            }
            const midPx = orders[i - 1].px + (pxDiff / subRanges) * (j + 1);

            let midRatio = (ratioDiff * midSz) / orders[i].sz;

            if (midRatio < 0) {
                console.log('>>> negative ratio');
            }

            const newOrder = {
                ...orders[i],
                px: midPx,
                sz: midSz,
                ratio: (orders[i].ratio || 0) + midRatio,
            };
            highResOrders.push(newOrder);
        }
    }

    return highResOrders;
};

export const useOrderBookStore = create<OrderBookStore>((set, get) => ({
    buys: [],
    sells: [],
    highResBuys: [],
    highResSells: [],
    selectedResolution: null,
    selectedMode: 'symbol',
    orderBookState: TableState.LOADING,
    trades: [],
    setOrderBook: (buys: OrderBookRowIF[], sells: OrderBookRowIF[]) => {
        const highResBuys = interpolateOrderBookData(buys);
        const highResSells = interpolateOrderBookData(sells);
        set({ buys, sells, highResBuys, highResSells });
    },
    setSelectedResolution: (selectedResolution: OrderRowResolutionIF | null) =>
        set({ selectedResolution }),
    setSelectedMode: (selectedMode: OrderBookMode) => set({ selectedMode }),
    setOrderBookState: (orderBookState: TableState) => set({ orderBookState }),
    setTrades: (trades: OrderBookTradeIF[]) => set({ trades }),
}));
