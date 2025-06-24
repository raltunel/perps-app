import { create } from 'zustand';

// shape of the return obj produced by this store
export interface AnnouncementStoreIF {
    wasViewed: string[];
    markViewed: (a: string) => void;
    checkIfViewed: (a: string) => boolean;
}

// the actual data store
export const useAnnouncementStore = create<AnnouncementStoreIF>((set, get) => ({
    // raw data consumed by the app
    wasViewed: [],
    // method to record an announcement as viewed
    markViewed: (a: string): void =>
        set({ wasViewed: [...get().wasViewed, a] }),
    // method to determine whether an announcement was previously viewed
    checkIfViewed: (a: string): boolean => get().wasViewed.includes(a),
}));
