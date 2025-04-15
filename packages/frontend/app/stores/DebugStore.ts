import { create } from 'zustand';

import { debugWallets, wsEnvironments, wsUrls } from '~/utils/Constants';

export type DebugWallet = {
    label: string;
    address: string;
};

interface DebugStore {
    wsUrl: string;
    setWsUrl: (wsUrl: string) => void;
    wsEnvironment: 'mock' | 'hl' | 'local' | 'mainnet' | 'testnet';
    setWsEnvironment: (wsEnvironment: string) => void;
    debugWallet: DebugWallet;
    setDebugWallet: (debugWallet: DebugWallet) => void;
    isWsEnabled: boolean;
    setIsWsEnabled: (isWsEnabled: boolean) => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
    wsUrl: wsUrls[2],
    setWsUrl: (wsUrl: string) => set({ wsUrl }),
    wsEnvironment: wsEnvironments[1].value as
        | 'mock'
        | 'hl'
        | 'local'
        | 'mainnet'
        | 'testnet',
    setWsEnvironment: (wsEnvironment: string) =>
        set({
            wsEnvironment: wsEnvironment as
                | 'mock'
                | 'hl'
                | 'local'
                | 'mainnet'
                | 'testnet',
        }),
    debugWallet: debugWallets[2],
    setDebugWallet: (debugWallet: DebugWallet) => set({ debugWallet }),
    isWsEnabled: true,
    setIsWsEnabled: (isWsEnabled: boolean) => set({ isWsEnabled }),
}));
