import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Fuul, UserIdentifierType } from '@fuul/sdk';
import type { PublicKey } from '@solana/web3.js';

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
    confirmRefCode: (
        walletKey: PublicKey,
        signMessage: (message: Uint8Array) => Promise<Uint8Array>,
    ) => Promise<void>;
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
                async confirmRefCode(
                    walletKey: PublicKey,
                    signMessage: (message: Uint8Array) => Promise<Uint8Array>,
                ): Promise<void> {
                    const code: string | null = get().refCode.value;
                    if (!code) return;
                    try {
                        // Create a dynamic message with current date
                        const currentDate = new Date()
                            .toISOString()
                            .split('T')[0];
                        const message = `Accept affiliate code ${code} on ${currentDate}`;

                        // Convert message to Uint8Array
                        const messageBytes = new TextEncoder().encode(message);

                        // Get the signature from the session
                        const signatureBytes = await signMessage(messageBytes);

                        // Convert the signature to base64
                        const signatureArray = Array.from(
                            new Uint8Array(signatureBytes),
                        );
                        const binaryString = String.fromCharCode.apply(
                            null,
                            signatureArray,
                        );
                        const signature = btoa(binaryString);

                        // Call the Fuul SDK to identify the user

                        try {
                            const response = await Fuul.identifyUser({
                                identifier: walletKey.toString(),
                                identifierType:
                                    UserIdentifierType.SolanaAddress,
                                signature,
                                signaturePublicKey: walletKey.toString(),
                                message,
                            });
                            console.log(
                                'Fuul.identifyUser successful:',
                                response,
                            );
                            // TODO: @emily this step needs to be gatekept until a successful response
                            _setRefCode(get().refCode.value, true);
                        } catch (error: any) {
                            console.error('Detailed error in identifyUser:', {
                                message: error.message,
                                status: error.response?.status,
                                statusText: error.response?.statusText,
                                data: error.response?.data,
                                config: {
                                    url: error.config?.url,
                                    method: error.config?.method,
                                    headers: error.config?.headers,
                                },
                            });
                            throw error; // Re-throw to be caught by the outer catch
                        }
                    } catch (error) {
                        console.error('Error in identifyUser:', error);
                        // Optionally show a user-friendly error message
                        // You might want to implement this based on your UI framework
                        // showErrorToast('Failed to identify user. Please try again.');
                    }
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
