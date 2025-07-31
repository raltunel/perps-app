import { create } from 'zustand';
import type { UserBalanceIF } from '~/utils/UserDataIFs';

interface MarginBucketStore {
    balance: UserBalanceIF | null;
    isLoading: boolean;
    error: string | null;
    setBalance: (balance: UserBalanceIF | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export const useMarginBucketStore = create<MarginBucketStore>((set) => ({
    balance: null,
    isLoading: true,
    error: null,
    setBalance: (balance) => set({ balance }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    reset: () => set({ balance: null, isLoading: true, error: null }),
}));
