import { create } from 'zustand';
import { setLS } from '~/utils/AppUtils';
import type { SymbolInfoIF } from '~/utils/SymbolInfoIFs';
import { createUserTradesSlice, type UserTradeStore } from './UserOrderStore';
import { persist } from 'zustand/middleware';


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
    removeFromFavKeys: (coin: string) => void;
}

const useTradeDataStore =  create<TradeDataStore>()(
    persist(
        (set, get) => ({
    ...createUserTradesSlice(set, get),
    symbol: 'BTC',
    setSymbol: (symbol: string) => {
        setLS('activeCoin', symbol);
        set({ symbol });
        get().setUserSymbolOrders(get().userOrders.filter((e:any) => e.coin === symbol));
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
    favKeys: ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'LINK'],
    setFavKeys: (favs: string[]) => set({ favKeys: favs }),
    addToFavKeys: (coin: string) => {
        if (get().favKeys.filter((e: any) => e == coin).length === 0) {
            set({ favKeys: [...get().favKeys, coin] });
            set({ favCoins: [...get().favCoins, get().coins.find((e: any) => e.coin == coin) as SymbolInfoIF] });
        }
    },
    removeFromFavKeys: (coin: string) => {
        set({ favKeys: get().favKeys.filter((e: any) => e != coin) });
        set({ favCoins: get().favCoins.filter((e: any) => e.coin != coin) });
    },
    favCoins: [],
    setFavCoins: (favs: SymbolInfoIF[]) => set({ favCoins: favs }),
    coins: [],
    setCoins: (coins: SymbolInfoIF[]) => set({ coins })
}),
{
    name: 'TRADE_DATA',
    partialize: (state:any) => ({
        favKeys: state.favKeys,
        symbol: state.symbol,
    }),
}
)
);



export { useTradeDataStore };