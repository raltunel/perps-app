import { create } from 'zustand';

export interface UserDataStore {
    userAddress: string;
    setUserAddress: (userAddress: string) => void;
    referralCode: string;
    setReferralCode: (r: string) => void;
    clearReferralCode: () => void;
}

export const useUserDataStore = create<UserDataStore>((set) => ({
    userAddress: '',
    setUserAddress: (userAddress: string) => {
        set({ userAddress });
    },
    referralCode: '',
    setReferralCode: (r: string) => set({ referralCode: r }),
    clearReferralCode: () => set({ referralCode: '' }),
}));
