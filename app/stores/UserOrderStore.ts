import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';

export interface UserTradeStore {
    userOrders: OrderDataIF[];
    userSymbolOrders: OrderDataIF[];
    setUserOrders: (userOrders: OrderDataIF[]) => void;
    setUserSymbolOrders: (userSymbolOrders: OrderDataIF[]) => void;
    orderHistory: OrderDataIF[];
    addOrderToHistory: (orderHistory: OrderDataIF[]) => void;
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
    },
    orderHistory: [],
    addOrderToHistory: (newOrders: OrderDataIF[]) => {
        const newOrderHistory = [...newOrders, ...get().orderHistory].slice(0, 50);
        newOrderHistory.sort((a, b) => b.timestamp - a.timestamp);
        set({ orderHistory: newOrderHistory })
    }
});

