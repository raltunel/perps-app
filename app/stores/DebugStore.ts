import { create } from 'zustand';

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
    debugWallet: debugWallets[1],
    setDebugWallet: (debugWallet: DebugWallet) => set({ debugWallet })
}));