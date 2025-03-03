import {create} from 'zustand';
import type { OrderBookTradeIF, OrderRowIF } from '~/utils/orderbook/OrderBookIFs';

interface UIStore {
    orderBookMode: 'tab' | 'stacked' | 'large';
    setOrderBookMode: (mode: 'tab' | 'stacked' | 'large') => void;
}

export const useUIStore = create<UIStore>((set) => ({
    orderBookMode: 'tab',
    setOrderBookMode: (mode: 'tab' | 'stacked' | 'large') => set({ orderBookMode: mode })
}));