import { useCallback, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { isEstablished, useSession } from '@fogo/sessions-sdk-react';
import { WithdrawService } from '~/services/withdrawService';

interface WithdrawServiceResult {
    success: boolean;
    error?: string;
    signature?: string;
}

interface AvailableWithdrawBalance {
    balance: number;
    decimalized: number;
}

export interface UseWithdrawServiceReturn {
    availableBalance: AvailableWithdrawBalance | null;
    isLoading: boolean;
    error: string | null;
    executeWithdraw: (amount: number) => Promise<WithdrawServiceResult>;
    refreshBalance: () => Promise<void>;
    validateAmount: (amount: number) => { isValid: boolean; message?: string };
}

/**
 * Hook for managing withdraw functionality with Solana transactions
 */
export function useWithdrawService(): UseWithdrawServiceReturn {
    const sessionState = useSession();
    const [availableBalance, setAvailableBalance] =
        useState<AvailableWithdrawBalance | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [withdrawService, setWithdrawService] =
        useState<WithdrawService | null>(null);

    // Initialize withdraw service when session is established
    useEffect(() => {
        console.log('🔄 Withdraw service initialization check');
        console.log('  - Session established:', isEstablished(sessionState));
        console.log('  - Session state:', sessionState);

        if (isEstablished(sessionState)) {
            console.log(
                '✅ Creating withdraw service with connection:',
                sessionState.connection,
            );
            const service = new WithdrawService(sessionState.connection);
            setWithdrawService(service);
        } else {
            console.log(
                '⚠️ Session not established, withdraw service not created',
            );
            setWithdrawService(null);
        }
    }, [sessionState]);

    // Fetch available withdraw balance
    const refreshBalance = useCallback(async () => {
        console.log('🔄 Attempting to refresh withdraw balance');
        console.log('  - Withdraw service exists:', !!withdrawService);
        console.log('  - Session established:', isEstablished(sessionState));

        if (!withdrawService || !isEstablished(sessionState)) {
            console.log(
                '⚠️ Cannot refresh balance - service or session not ready',
            );
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Get user's wallet public key
            const userWalletKey =
                sessionState.userPublicKey ||
                sessionState.walletPublicKey ||
                sessionState.sessionPublicKey;

            console.log('🔑 Available keys in session:', {
                userPublicKey: sessionState.userPublicKey?.toString(),
                walletPublicKey: sessionState.walletPublicKey?.toString(),
                sessionPublicKey: sessionState.sessionPublicKey?.toString(),
            });

            // Try session key first (as that's what's used for transactions)
            console.log(
                '🔑 Trying session key first:',
                sessionState.sessionPublicKey.toString(),
            );
            let balance = await withdrawService.getAvailableWithdrawBalance(
                sessionState.sessionPublicKey,
            );

            // If no balance with session key, try wallet key
            if (!balance || balance.decimalized === 0) {
                console.log(
                    '🔑 No balance with session key, trying wallet key:',
                    userWalletKey.toString(),
                );
                balance =
                    await withdrawService.getAvailableWithdrawBalance(
                        userWalletKey,
                    );
            }

            if (balance) {
                setAvailableBalance(balance);
                console.log('✅ Available withdraw balance fetched:', balance);
            } else {
                setAvailableBalance({ balance: 0, decimalized: 0 });
                console.log('⚠️ No available balance to withdraw');
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch available balance';
            setError(errorMessage);
            console.error('❌ Error fetching available balance:', err);
        } finally {
            setIsLoading(false);
        }
    }, [withdrawService, sessionState]);

    // Fetch balance on mount and when service is available
    useEffect(() => {
        console.log(
            '🔄 Withdraw service availability changed:',
            !!withdrawService,
        );
        if (withdrawService) {
            console.log('✅ Withdraw service ready, refreshing balance...');
            refreshBalance();
        }
    }, [withdrawService, refreshBalance]);

    // Execute withdraw transaction
    const executeWithdraw = useCallback(
        async (amount: number): Promise<WithdrawServiceResult> => {
            if (!withdrawService || !isEstablished(sessionState)) {
                return {
                    success: false,
                    error: 'Session not established',
                };
            }

            setIsLoading(true);
            setError(null);

            try {
                // Debug session state to find correct method name
                console.log('🔍 Session state debug for sendTransaction:');
                console.log(
                    '  - sessionState keys:',
                    Object.keys(sessionState),
                );
                console.log(
                    '  - sendTransaction type:',
                    typeof sessionState.sendTransaction,
                );
                console.log(
                    '  - Available methods:',
                    Object.keys(sessionState).filter(
                        (key) => typeof sessionState[key] === 'function',
                    ),
                );

                // Get both keys: session key for transaction building, user wallet key for PDAs
                const userWalletKey =
                    sessionState.userPublicKey ||
                    sessionState.walletPublicKey ||
                    sessionState.sessionPublicKey;

                // Ensure sendTransaction is available
                if (typeof sessionState.sendTransaction !== 'function') {
                    throw new Error(
                        `sendTransaction is not available. Available methods: ${Object.keys(
                            sessionState,
                        )
                            .filter(
                                (key) =>
                                    typeof sessionState[key] === 'function',
                            )
                            .join(', ')}`,
                    );
                }

                const result = await withdrawService.executeWithdraw(
                    amount,
                    sessionState.sessionPublicKey, // For transaction building
                    userWalletKey, // For PDA construction
                    sessionState.sendTransaction,
                );

                if (result.success) {
                    // Refresh balance after successful withdraw
                    await refreshBalance();
                } else {
                    setError(result.error || 'Withdraw failed');
                }

                return result;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Withdraw failed';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                };
            } finally {
                setIsLoading(false);
            }
        },
        [withdrawService, sessionState, refreshBalance],
    );

    // Validate withdraw amount
    const validateAmount = useCallback(
        (amount: number): { isValid: boolean; message?: string } => {
            if (!withdrawService) {
                return { isValid: false, message: 'Service not available' };
            }

            // Check against available balance
            if (availableBalance && amount > availableBalance.decimalized) {
                return {
                    isValid: false,
                    message: `Amount exceeds available balance of $${availableBalance.decimalized.toFixed(2)}`,
                };
            }

            return withdrawService.validateWithdrawAmount(amount);
        },
        [withdrawService, availableBalance],
    );

    return {
        availableBalance,
        isLoading,
        error,
        executeWithdraw,
        refreshBalance,
        validateAmount,
    };
}
