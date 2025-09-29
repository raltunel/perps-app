import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface RefCodeIF {
    value: string;
    isConfirmed: boolean;
}

export interface ReferralStoreIF {
    codes: Map<string, RefCodeIF>;
    active: RefCodeIF | null;
    activateCode(address: string, refCode: string, isConfirmed: boolean): void;
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
            active: null,
            // add a ref code to the persisted map and update `active` val
            activateCode(
                address: string,
                refCode: string,
                isConfirmed: boolean,
            ): void {
                set((state) => {
                    // get map of persisted codes from state
                    const newCodes = new Map<string, RefCodeIF>(state.codes);
                    // check existing state for a ref code on this address
                    const persistedRefCode: RefCodeIF | undefined =
                        get().getCode(address.toLowerCase());
                    // if no ref code exists, create one
                    const refCodeObj: RefCodeIF = persistedRefCode || {
                        value: refCode,
                        isConfirmed,
                    };
                    // initialize an output variable with the active ref code
                    const output = { active: refCodeObj };
                    // if a persisted ref code was not found, add to map
                    persistedRefCode ??
                        Object.assign(output, {
                            codes: newCodes.set(
                                address.toLowerCase(),
                                refCodeObj,
                            ),
                        });
                    // return the updated state
                    return output;
                });
            },
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
            set(address: string, refCode: string, isConfirmed: boolean): void {
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
            storage: {
                getItem: (name) => {
                    const str = ssrSafeStorage().getItem(name);
                    if (!str) return null;
                    const parsed = JSON.parse(str);
                    return {
                        state: {
                            codes: new Map(parsed.state?.codes || []),
                        },
                    };
                },
                setItem: (name, value) => {
                    const codes = value.state?.codes;
                    const codesArray =
                        codes instanceof Map
                            ? Array.from(codes.entries())
                            : codes || [];
                    const str = JSON.stringify({
                        state: {
                            codes: codesArray,
                        },
                    });
                    ssrSafeStorage().setItem(name, str);
                },
                removeItem: (name) => ssrSafeStorage().removeItem(name),
            },
            version: 1,
        },
    ),
);
