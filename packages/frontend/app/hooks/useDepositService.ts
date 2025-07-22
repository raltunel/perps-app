import { useCallback, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { isEstablished, useSession } from '@fogo/sessions-sdk-react';
import { DepositService } from '~/services/depositService';

interface DepositServiceResult {
    success: boolean;
    error?: string;
    signature?: string;
}

interface UserBalance {
    balance: number;
    decimalized: number;
}

export interface UseDepositServiceReturn {
    balance: UserBalance | null;
    isLoading: boolean;
    error: string | null;
    executeDeposit: (amount: number) => Promise<DepositServiceResult>;
    refreshBalance: () => Promise<void>;
    validateAmount: (amount: number) => { isValid: boolean; message?: string };
}

/**
 * Hook for managing deposit functionality with Solana transactions
 */
export function useDepositService(): UseDepositServiceReturn {
    const sessionState = useSession();
    const [balance, setBalance] = useState<UserBalance | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [depositService, setDepositService] = useState<DepositService | null>(
        null,
    );

    // Initialize deposit service when session is established
    useEffect(() => {
        if (isEstablished(sessionState)) {
            const service = new DepositService(sessionState.connection);
            setDepositService(service);
        } else {
            setDepositService(null);
        }
    }, [sessionState]);

    // Fetch user balance
    const refreshBalance = useCallback(async () => {
        if (!depositService || !isEstablished(sessionState)) {
            setError('Session not established');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('🔍 Session state debug:', {
                sessionPublicKey: sessionState.sessionPublicKey?.toString(),
                userPublicKey: sessionState.userPublicKey?.toString(),
                walletPublicKey: sessionState.walletPublicKey?.toString(),
                allKeys: Object.keys(sessionState).filter(
                    (key) =>
                        key.toLowerCase().includes('public') ||
                        key.toLowerCase().includes('key'),
                ),
            });

            // Try to find the correct user wallet public key
            const userWalletKey =
                sessionState.userPublicKey ||
                sessionState.walletPublicKey ||
                sessionState.sessionPublicKey;

            console.log('🔑 Using wallet key:', userWalletKey?.toString());

            const userBalance =
                await depositService.getUserBalance(userWalletKey);
            setBalance(userBalance);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to fetch balance';
            setError(errorMessage);
            console.error('Error fetching balance:', err);
        } finally {
            setIsLoading(false);
        }
    }, [depositService, sessionState]);

    // Fetch balance on mount and when service is available
    useEffect(() => {
        if (depositService) {
            refreshBalance();
        }
    }, [depositService, refreshBalance]);

    // Execute deposit transaction
    const executeDeposit = useCallback(
        async (amount: number): Promise<DepositServiceResult> => {
            if (!depositService || !isEstablished(sessionState)) {
                return {
                    success: false,
                    error: 'Session not established',
                };
            }

            setIsLoading(true);
            setError(null);

            try {
                // Use the same wallet key logic as refreshBalance
                const userWalletKey =
                    sessionState.userPublicKey ||
                    sessionState.walletPublicKey ||
                    sessionState.sessionPublicKey;

                const result = await depositService.executeDeposit(
                    amount,
                    userWalletKey,
                    sessionState.sendTransaction,
                );

                if (result.success) {
                    // Refresh balance after successful deposit
                    await refreshBalance();
                } else {
                    setError(result.error || 'Deposit failed');
                }

                return result;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Deposit failed';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                };
            } finally {
                setIsLoading(false);
            }
        },
        [depositService, sessionState, refreshBalance],
    );

    // Validate deposit amount
    const validateAmount = useCallback(
        (amount: number): { isValid: boolean; message?: string } => {
            if (!depositService) {
                return { isValid: false, message: 'Service not available' };
            }
            return depositService.validateDepositAmount(amount);
        },
        [depositService],
    );

    return {
        balance,
        isLoading,
        error,
        executeDeposit,
        refreshBalance,
        validateAmount,
    };
}
