import type { Environment } from '@perps-app/sdk';
import { create } from 'zustand';

import { debugWallets } from '~/utils/Constants';

export type DebugWallet = {
    label: string;
    address: string;
};

interface DebugStore {
    environment: Environment;
    setEnvironment: (environment: Environment) => void;
    debugWallet: DebugWallet;
    setDebugWallet: (debugWallet: DebugWallet) => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
    environment: 'hl',
    setEnvironment: (environment: Environment) => set({ environment }),
    debugWallet: debugWallets[2],
    setDebugWallet: (debugWallet: DebugWallet) => set({ debugWallet }),
}));
