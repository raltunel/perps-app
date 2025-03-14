import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';

export interface UserTradeStore {
    userOrders: OrderDataIF[];
    userSymbolOrders: OrderDataIF[];
    setUserOrders: (userOrders: OrderDataIF[]) => void;
    setUserSymbolOrders: (userSymbolOrders: OrderDataIF[]) => void;
}

export const createUserTradesSlice = (set:any, get:any) => ({
    userOrders: [],
    userSymbolOrders: [],
    setUserOrders: (userOrders: OrderDataIF[]) => {
        set({ userOrders })
        get().setUserSymbolOrders(userOrders.filter(e=> e.coin === get().symbol))
    },
    setUserSymbolOrders: (userSymbolOrders: OrderDataIF[]) => {
        set({ userSymbolOrders })
    }
});

