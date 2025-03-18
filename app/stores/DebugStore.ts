import {create} from 'zustand';
import type { OrderBookTradeIF, OrderBookRowIF } from '~/utils/orderbook/OrderBookIFs';

import { debugWallets, wsUrls } from '~/utils/Constants';

export type DebugWallet = {
    label: string;
    address: string;
}

interface DebugStore {
    wsUrl: string;
    setWsUrl: (wsUrl: string) => void;
    debugWallet: DebugWallet;
    setDebugWallet: (debugWallet: DebugWallet) => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
    wsUrl: wsUrls[0],
    setWsUrl: (wsUrl: string) => set({ wsUrl }),
    debugWallet: debugWallets[0],
    setDebugWallet: (debugWallet: DebugWallet) => set({ debugWallet })
}));