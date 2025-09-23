import { Fuul, UserIdentifierType } from '@fuul/sdk';
import type { PublicKey } from '@solana/web3.js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface RefCodeIF {
    value: string;
    isConfirmed: boolean;
    wallet: string;
}

interface ConfirmRefCodeArgsIF {
    walletKey: PublicKey;
    signMessage: (message: Uint8Array) => Promise<Uint8Array>;
    refCode?: RefCodeIF;
}

export interface ReferralStoreIF {
    active: RefCodeIF | null;
    all: RefCodeIF[];
    add(rc: RefCodeIF): void;
    enable(addr: string): void;
    disable(): void;
    confirm(options: ConfirmRefCodeArgsIF): Promise<void>;
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
        (set, get) => {
            // obj returned to app when store is instantiated
            return {
                active: null,
                all: [],
                add(rc: RefCodeIF): void {
                    const allRefCodes: RefCodeIF[] = get().all;
                    set({
                        active: rc,
                        all: [
                            rc,
                            ...allRefCodes.filter(
                                (r: RefCodeIF) =>
                                    r.value.toLowerCase() !==
                                    rc.value.toLowerCase(),
                            ),
                        ],
                    });
                },
                enable(addr: string): void {
                    try {
                        const persisted: RefCodeIF | undefined = get().all.find(
                            (rc: RefCodeIF) =>
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
                disable(): void {
                    set({ active: null });
                },
                async confirm(options: ConfirmRefCodeArgsIF): Promise<void> {
                    const {
                        walletKey,
                        signMessage,
                        refCode = get().active,
                    } = options;
                    if (!refCode) return;
                    try {
                        // Create a dynamic message with current date
                        const currentDate = new Date()
                            .toISOString()
                            .split('T')[0];
                        const message = `Accept affiliate code ${refCode.value} on ${currentDate}`;

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
                            // // TODO: @emily this step needs to be gatekept until a successful response
                            // _setRefCode(get().refCode.value, true);
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
