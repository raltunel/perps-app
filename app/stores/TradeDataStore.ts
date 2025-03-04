import {create} from 'zustand';
import type { SymbolInfoIF } from '~/utils/SymbolInfoIFs';

interface TradeDataStore {
    symbol: string;
    setSymbol: (symbol: string) => void;
    symbolInfo: SymbolInfoIF | null;
    setSymbolInfo: (symbolInfo: SymbolInfoIF) => void;
}

export const useTradeDataStore = create<TradeDataStore>((set, get) => ({
    symbol: 'BTC',
    setSymbol: (symbol: string) => set({ symbol }),
    symbolInfo: null,
    setSymbolInfo: (symbolInfo: SymbolInfoIF) => {
        const prevSymbolInfo = get().symbolInfo;
        if(prevSymbolInfo){
            const lastPriceChange = symbolInfo.markPx - prevSymbolInfo.markPx;
            symbolInfo.lastPriceChange = lastPriceChange;
        }
        set({ symbolInfo })
    },
}));