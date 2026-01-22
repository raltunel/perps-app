import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LiqLevel } from '~/routes/trade/liquidationsChart/LiquidationUtils';
import { TableState } from '~/utils/CommonIFs';

// Fixed threshold values (USD amounts that separate the 4 color levels)
// Level 1 (purple): < $100K | Level 2 (blue): $100K-$1M | Level 3 (green): $1M-$10M | Level 4 (yellow): > $10M
const LIQ_THRESHOLDS: [number, number, number] = [
    100_000, 1_000_000, 10_000_000,
];

interface LiquidationStore {
    buyLiqs: LiqLevel[];
    sellLiqs: LiqLevel[];
    setBuyLiqs: (buyLiqs: LiqLevel[]) => void;
    setSellLiqs: (sellLiqs: LiqLevel[]) => void;
    loadingState: TableState;
    setLoadingState: (loadingState: TableState) => void;
    maxLiqUSD: number;
    setMaxLiqUSD: (maxLiqUSD: number) => void;
    minLiqUSD: number;
    setMinLiqUSD: (minLiqUSD: number) => void;
    // 3 fixed threshold values (USD) that define boundaries between 4 color levels
    liqThresholds: [number, number, number];
}

export const useLiquidationStore = create<LiquidationStore>()(
    persist(
        (set) => ({
            buyLiqs: [],
            sellLiqs: [],
            setBuyLiqs: (buyLiqs: LiqLevel[]) => set({ buyLiqs }),
            setSellLiqs: (sellLiqs: LiqLevel[]) => set({ sellLiqs }),
            loadingState: TableState.LOADING,
            setLoadingState: (loadingState: TableState) =>
                set({ loadingState }),
            maxLiqUSD: 0,
            setMaxLiqUSD: (maxLiqUSD: number) => set({ maxLiqUSD }),
            minLiqUSD: 0,
            setMinLiqUSD: (minLiqUSD: number) => set({ minLiqUSD }),
            liqThresholds: LIQ_THRESHOLDS,
        }),
        {
            name: 'LIQCHART',
            storage: createJSONStorage(() => localStorage),
            partialize: () => ({}),
        },
    ),
);
