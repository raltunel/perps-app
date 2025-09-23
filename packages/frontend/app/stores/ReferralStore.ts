import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface RefCode {
    value: string;
    isConfirmed: boolean;
    wallet: string;
}

export interface ReferralStore {
    active: RefCode | null;
    all: RefCode[];
    add(rc: RefCode): void;
    enable(addr: string): void;
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

export const useReferralStore = create<ReferralStore>()(
    persist(
        (set, get) => {
            // obj returned to app when store is instantiated
            return {
                active: null,
                all: [],
                add(rc: RefCode): void {
                    const allRefCodes: RefCode[] = get().all;
                    set({
                        active: rc,
                        all: [
                            rc,
                            ...allRefCodes.filter(
                                (r: RefCode) =>
                                    r.value.toLowerCase() !==
                                    rc.value.toLowerCase(),
                            ),
                        ],
                    });
                },
                enable(addr: string): void {
                    try {
                        const persisted: RefCode | undefined = get().all.find(
                            (rc: RefCode) =>
                                rc.wallet.toLowerCase() === addr.toLowerCase(),
                        );
                        if (!persisted) {
                            throw new Error(
                                'Referral code not found for address: ' + addr,
                            );
                        } else {
                            set({ active: persisted });
                        }
                    } catch (e) {
                        console.error(e);
                    }
                },
            };
        },
        {
            // local storage key for persisted data
            name: LS_KEY,
            storage: createJSONStorage(ssrSafeStorage),
            version: 1,
        },
    ),
);
