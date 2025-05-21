import { create } from 'zustand';
import type { TradeSlotIF } from '~/utils/TradeModuleIFs';

interface TradeModuleStore {
    tradeSlot: TradeSlotIF | null;
    setTradeSlot: (tradeSlot: TradeSlotIF | null) => void;
}

export const useTradeModuleStore = create<TradeModuleStore>((set) => ({
    tradeSlot: null,
    setTradeSlot: (tradeSlot: TradeSlotIF | null) => set({ tradeSlot }),
}));
