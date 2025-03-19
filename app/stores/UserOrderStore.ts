import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';

export interface UserTradeStore {
    userOrders: OrderDataIF[];
    userSymbolOrders: OrderDataIF[];
    setUserOrders: (userOrders: OrderDataIF[]) => void;
    setUserSymbolOrders: (userSymbolOrders: OrderDataIF[]) => void;
    updateUserOrders: (userOrders: OrderDataIF[]) => void;
    removeFills: (fills: OrderDataIF[]) => void;
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
    updateUserOrders: (updates: OrderDataIF[]) => {
        const currentOrders = get().userOrders;
        const cancels = new Set(updates.filter(e=> e.status === 'canceled').map(e=> e.cloid));
        // console.log('>>> cancels', cancels);
        const notCancelled = currentOrders.filter((e:OrderDataIF)=> !cancels.has(e.cloid));
        const notCancelledSet = new Set(notCancelled.map(e=> e.cloid));
        const currentOrdersSet = new Set(currentOrders.map(e=> e.cloid));
        // console.log('>>> notCancelled', notCancelled);
        const newOrders = updates.filter(e=> e.status === 'open' && !notCancelledSet.has(e.cloid) && !currentOrdersSet.has(e.cloid));
        // const newOrders:OrderDataIF[] = [];
        const updatedOrders = [...notCancelled, ...newOrders];
        console.log('>>> updatedOrders', updatedOrders);
        console.log('>>> updatedOrders uniqui ids', new Set(updatedOrders.map(e=> e.cloid)).size);
        set({ userOrders: updatedOrders })

        get().setUserSymbolOrders(updatedOrders.filter(e=> e.coin === get().symbol))
    },
    removeFills: (fills: OrderDataIF[]) => {
        const currentOrders = get().userOrders;
        const reducedOrders = currentOrders.filter((e:OrderDataIF)=> !fills.some(f=> f.cloid === e.cloid));
        set({ userOrders: reducedOrders })
        get().setUserSymbolOrders(reducedOrders.filter((e:OrderDataIF)=> e.coin === get().symbol))
    }
});

