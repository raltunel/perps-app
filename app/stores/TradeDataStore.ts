import { use } from 'react';
import { create } from 'zustand';
import { setLS } from '~/utils/AppUtils';
import { NumFormatTypes } from '~/utils/Constants';
import type { NumFormat } from '~/utils/Constants';
import type { SymbolInfoIF } from '~/utils/SymbolInfoIFs';
import { createUserTradesSlice, type UserTradeStore } from './UserOrderStore';
import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';



type TradeDataStore = UserTradeStore & {
    symbol: string;
    setSymbol: (symbol: string) => void;
    symbolInfo: SymbolInfoIF | null;
    setSymbolInfo: (symbolInfo: SymbolInfoIF) => void;
    favKeys: string[];
    setFavKeys: (favs: string[]) => void;
    addToFavKeys: (coin: string) => void;
    favCoins: SymbolInfoIF[];
    setFavCoins: (favs: SymbolInfoIF[]) => void;
    coins: SymbolInfoIF[],
    setCoins: (coins: SymbolInfoIF[]) => void;
}

const useTradeDataStore = create<TradeDataStore>((set, get) => ({
    ...createUserTradesSlice(set, get),
    symbol: '',
    setSymbol: (symbol: string) => {
        setLS('activeCoin', symbol);
        set({ symbol });
        get().setUserSymbolOrders(get().userOrders.filter(e => e.coin === symbol));
    },
    symbolInfo: null,
    setSymbolInfo: (symbolInfo: SymbolInfoIF) => {
        const prevSymbolInfo = get().symbolInfo;
        if (prevSymbolInfo) {
            const lastPriceChange = symbolInfo.markPx - prevSymbolInfo.markPx;
            symbolInfo.lastPriceChange = lastPriceChange;
        }
        set({ symbolInfo })
    },
    favKeys: [],
    setFavKeys: (favs: string[]) => set({ favKeys: favs }),
    addToFavKeys: (coin: string) => {
        if (get().favKeys.filter(e => e == coin).length === 0) {
            set({ favKeys: [...get().favKeys, coin] });
        }
    },
    favCoins: [],
    setFavCoins: (favs: SymbolInfoIF[]) => set({ favCoins: favs }),
    coins: [],
    setCoins: (coins: SymbolInfoIF[]) => set({ coins })
}));



export { useTradeDataStore };