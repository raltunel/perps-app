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
            // private helper fn to set the ref code and validation status
            function _setRefCode(r: string, v: boolean) {
                set({
                    refCode: {
                        value: r,
                        isValidated: v,
                    },
                });
            }
            // obj returned to app when store is instantiated
            return {
                userAddress: '',
                setUserAddress: (userAddress: string) => {
                    set({ userAddress });
                },
                referralCode: '',
                setReferralCode: (r: string) => set({ referralCode: r }),
                clearReferralCode: () => set({ referralCode: '' }),
                // string value of the ref code and whether it has been validated
                refCode: {
                    value: '',
                    isValidated: false,
                },
                // record a new referral code to store
                setRefCode(r: string): void {
                    _setRefCode(r, false);
                },
                // record a new referral code to store if different from the last
                initializeRefCode(r: string): void {
                    const lastCode: string | null = get().refCode.value;
                    if (lastCode !== r) {
                        _setRefCode(r, false);
                    }
                },
                // mark the referral code as validated
                validateRefCode(): void {
                    _setRefCode(get().refCode.value, true);
                },
            };
        },
        {
            // local storage key for persisted data
            name: LS_KEY,
            // storage engine
            storage: createJSONStorage(() => localStorage),
            // version number (needed for migrations)
            version: 1,
            // data object to persist in local storage
            partialize: (state: UserDataStore) => ({
                referralCode: state.referralCode,
                refCode: state.refCode,
            }),
        },
    ),
);
