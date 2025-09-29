import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface RefCodeIF {
    value: string;
    isConfirmed: boolean;
}

export interface ReferralStoreIF {
    codes: Map<string, RefCodeIF>;
    getCode(address: string): RefCodeIF | undefined;
    confirmCode(address: string, refCode: string): void;
    set(address: string, refCode: string, isConfirmed: boolean): void;
}

const LS_KEY = 'AFFILIATE_DATA';

const ssrSafeStorage = () =>
    (typeof window !== 'undefined'
        ? window.localStorage
        : {
              getItem: (_key: string) => null,
              setItem: (_key: string, _value: string) => {},
              removeItem: (_key: string) => {},
              clear: () => {},
              key: (_index: number) => null,
              length: 0,
          }) as Storage;

export const useReferralStore = create<ReferralStoreIF>()(
    persist(
        (set, get) => ({
            codes: new Map<string, RefCodeIF>(),
            getCode(address: string): RefCodeIF | undefined {
                return get().codes.get(address.toLowerCase());
            },
            confirmCode(address: string, refCode: string): void {
                set((state) => {
                    const newCodes = new Map<string, RefCodeIF>(state.codes);
                    newCodes.set(address.toLowerCase(), {
                        value: refCode,
                        isConfirmed: true,
                    });
                    return { codes: newCodes };
                });
            },
            set(address: string, refCode: string, isConfirmed: boolean) {
                set((state) => {
                    const newCodes = new Map<string, RefCodeIF>(state.codes);
                    newCodes.set(address.toLowerCase(), {
                        value: refCode,
                        isConfirmed,
                    });
                    return { codes: newCodes };
                });
            },
        }),
        {
            name: LS_KEY,
            storage: createJSONStorage(ssrSafeStorage),
            version: 1,
            partialize: (state) => ({
                codes: Array.from(state.codes.entries()),
            }),
            merge: (persistedState, currentState) => ({
                ...currentState,
                codes: new Map((persistedState as any)?.codes || []),
            }),
        },
    ),
);
