import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReferralStoreIF {
    codes: Map<string, string>;
    cached: {
        value: string;
        hasDismissed: boolean;
    };
    dismiss(): void;
    cache(refCode: string): void;
    getCode(address: string): string | undefined;
    confirmCode(address: string, refCode: string): void;
    set(address: string, refCode: string): void;
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
            codes: new Map<string, string>(),
            cached: {
                value: '',
                hasDismissed: false,
            },
            cache(refCode: string): void {
                set({ cached: { value: refCode, hasDismissed: false } });
            },
            dismiss(): void {
                set({
                    cached: {
                        value: get().cached.value,
                        hasDismissed: true,
                    },
                });
            },
            getCode(address: string): string | undefined {
                return get().codes.get(address.toLowerCase());
            },
            confirmCode(address: string, refCode: string): void {
                set((state) => {
                    const newCodes = new Map<string, string>(state.codes);
                    newCodes.set(address.toLowerCase(), refCode);
                    return { codes: newCodes };
                });
            },
            set(address: string, refCode: string): void {
                set((state) => {
                    const newCodes = new Map<string, string>(state.codes);
                    newCodes.set(address.toLowerCase(), refCode);
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
                            active: parsed.state?.active || null,
                            cached: parsed.state?.cached || '',
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
                            active: value.state?.active,
                            cached: value.state?.cached,
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
