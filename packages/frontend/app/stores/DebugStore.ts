import type { Environment } from '@perps-app/sdk';
import { create } from 'zustand';

import { apiEnvironments, debugWallets, wsUrls } from '~/utils/Constants';

export type DebugWallet = {
    label: string;
    address: string;
};

interface DebugStore {
    environment: Environment;
    setEnvironment: (environment: Environment) => void;
    debugWallet: DebugWallet;
    setDebugWallet: (debugWallet: DebugWallet) => void;

    wsUrl: string;
    setWsUrl: (wsUrl: string) => void;
    wsEnvironment: string;
    setWsEnvironment: (wsEnvironment: string) => void;
    isWsEnabled: boolean;
    setIsWsEnabled: (isWsEnabled: boolean) => void;
    sdkEnabled: boolean;
    setSdkEnabled: (sdkEnabled: boolean) => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
    environment: 'hl',
    setEnvironment: (environment: Environment) => set({ environment }),
    debugWallet: debugWallets[2],
    setDebugWallet: (debugWallet: DebugWallet) => set({ debugWallet }),

    wsUrl: wsUrls[2],
    setWsUrl: (wsUrl: string) => set({ wsUrl }),
    wsEnvironment: apiEnvironments[1].value as
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
    isWsEnabled: true,
    setIsWsEnabled: (isWsEnabled: boolean) => set({ isWsEnabled }),
    sdkEnabled: true,
    setSdkEnabled: (sdkEnabled: boolean) => set({ sdkEnabled }),
}));
