import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface RefCodeIF {
    value: string;
    isConfirmed: boolean;
}

export interface ReferralStoreIF {
    codes: Map<string, RefCodeIF>;
    getCode(address: string): RefCodeIF | undefined;
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
        },
    ),
);
