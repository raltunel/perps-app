import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const LS_KEY = 'ALREADY_VIEWED';

// shape of the return obj produced by this store
export interface AlreadySeenStoreIF {
    viewed: string[];
    markAsViewed: (message: string) => void;
}

// the actual data store
export const useViewed = create<AlreadySeenStoreIF>()(
    // persist data in local storage (only values, not reducers)
    persist(
        (set, get) => ({
            viewed: [],
            markAsViewed: (message: string): void => {
                set({
                    viewed: [...get().viewed, message],
                });
            },
        }),
        {
            // key for local storage
            name: LS_KEY,
            // format and destination of data
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ v: state.viewed }),
        },
    ),
);
