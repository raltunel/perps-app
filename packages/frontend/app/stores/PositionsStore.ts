import { create } from 'zustand';
import type { PositionIF } from '~/utils/position/PositionIFs';
import type { MarginBucketAvail } from '@crocswap-libs/ambient-ember';

interface PositionsStore {
    positions: PositionIF[];
    marginBucket: MarginBucketAvail | null;
    isLoading: boolean;
    error: string | null;
    setPositions: (positions: PositionIF[]) => void;
    setMarginBucket: (bucket: MarginBucketAvail | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export const usePositionsStore = create<PositionsStore>((set) => ({
    positions: [],
    marginBucket: null,
    isLoading: true,
    error: null,
    setPositions: (positions) => set({ positions }),
    setMarginBucket: (marginBucket) => set({ marginBucket }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    reset: () =>
        set({
            positions: [],
            marginBucket: null,
            isLoading: true,
            error: null,
        }),
}));
