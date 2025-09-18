import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserDataStore {
    userAddress: string;
    setUserAddress: (userAddress: string) => void;
    referralCode: string;
    setReferralCode: (r: string) => void;
    clearReferralCode: () => void;
    refCode: {
        value: string;
        isValidated: boolean;
    };
    setRefCode: (r: string) => void;
    initializeRefCode: (r: string) => void;
    validateRefCode: () => void;
}

const LS_KEY = 'USER_DATA';

export const useUserDataStore = create<UserDataStore>()(
    persist(
        (set, get) => {
            function _setRefCode(r: string, v: boolean) {
                set({
                    refCode: {
                        value: r,
                        isValidated: v,
                    },
                });
            }
            return {
                userAddress: '',
                setUserAddress: (userAddress: string) => {
                    set({ userAddress });
                },
                referralCode: '',
                setReferralCode: (r: string) => set({ referralCode: r }),
                clearReferralCode: () => set({ referralCode: '' }),
                refCode: {
                    value: '',
                    isValidated: false,
                },
                setRefCode(r: string): void {
                    _setRefCode(r, false);
                },
                initializeRefCode(r: string): void {
                    const lastCode: string | null = get().refCode.value;
                    if (lastCode !== r) {
                        _setRefCode(r, false);
                    }
                },
                validateRefCode(): void {
                    _setRefCode(get().refCode.value, true);
                },
            };
        },
        {
            name: LS_KEY,
            storage: createJSONStorage(() => localStorage),
            version: 1,
            partialize: (state: UserDataStore) => ({
                referralCode: state.referralCode,
                refCode: state.refCode,
            }),
        },
    ),
);
