import {create} from 'zustand';

interface TradeDataStore {
    symbol: string;
    setSymbol: (symbol: string) => void;
}

export const useTradeDataStore = create<TradeDataStore>((set) => ({
    symbol: 'BTC',
    setSymbol: (symbol: string) => set({ symbol }),
}));