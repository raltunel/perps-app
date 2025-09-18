import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserDataStore {
    userAddress: string;
    setUserAddress: (userAddress: string) => void;
    referralCode: string;
    setReferralCode: (r: string) => void;
    clearReferralCode: () => void;
}

const LS_KEY = 'USER_DATA';

export const useUserDataStore = create<UserDataStore>()(
    persist(
        (set) => ({
            userAddress: '',
            setUserAddress: (userAddress: string) => {
                set({ userAddress });
            },
            referralCode: '',
            setReferralCode: (r: string) => set({ referralCode: r }),
            clearReferralCode: () => set({ referralCode: '' }),
        }),
        {
            name: LS_KEY,
            storage: createJSONStorage(() => localStorage),
            version: 1,
            partialize: (state: UserDataStore) => ({
                referralCode: state.referralCode,
            }),
        },
    ),
);

export function handleReferralCodeParam(): string | null {
    const REFERRAL_CODE_URL_PARAM = 'af';
    const urlParams: URLSearchParams = new URLSearchParams(
        window.location.search,
    );

    let referralCode: string | null = null;
    for (const [key, value] of urlParams) {
        if (key.toLowerCase() === REFERRAL_CODE_URL_PARAM) {
            referralCode = value;
            break;
        }
    }

    return referralCode;
}
