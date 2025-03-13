import {create} from 'zustand';
import type { OrderBookTradeIF, OrderDataIF, OrderRowIF } from '~/utils/orderbook/OrderBookIFs';
import { useTradeDataStore } from './TradeDataStore';

interface UserOrderStore {
    userOrders: OrderDataIF[];
    userSymbolOrders: OrderDataIF[];
    setUserOrders: (userOrders: OrderDataIF[]) => void;
    setUserSymbolOrders: (userSymbolOrders: OrderDataIF[]) => void;

}

const useUserOrderStore = create<UserOrderStore>((set) => ({
    userOrders: [],
    userSymbolOrders: [],
    setUserOrders: (userOrders: OrderDataIF[]) => set({ userOrders }),
    setUserSymbolOrders: (userSymbolOrders: OrderDataIF[]) => set({ userSymbolOrders })
}));


useUserOrderStore.subscribe(async (state) => {
    const userOrders = state.userOrders;
    const {symbol} = useTradeDataStore();
    const filteredOrders = userOrders.filter(order => order.coin === symbol);

    state.setUserSymbolOrders(filteredOrders);
    
})  


export {useUserOrderStore};