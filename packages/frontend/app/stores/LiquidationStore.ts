import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LiqLevel } from '~/routes/trade/liquidationsChart/LiquidationUtils';
import { TableState } from '~/utils/CommonIFs';

interface LiquidationStore {
    buyLiqs: LiqLevel[];
    sellLiqs: LiqLevel[];
    setBuyLiqs: (buyLiqs: LiqLevel[]) => void;
    setSellLiqs: (sellLiqs: LiqLevel[]) => void;
    loadingState: TableState;
    setLoadingState: (loadingState: TableState) => void;
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
        }),
        {
            name: 'LIQCHART',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({}),
        },
    ),
);
