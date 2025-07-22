import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDepositService } from '~/hooks/useDepositService';

interface PortfolioDataIF {
    id: string;
    name: string;
    // totalValueUSD: number;
    // availableBalance: number;
    balances: {
        contract: number;
        wallet: number;
    };
    unit: string;
    tradingVolume: {
        daily: number;
        weekly: number;
        biWeekly: number;
        monthly: number;
    };
    fees: {
        taker: number;
        maker: number;
    };
}

const CONTRACT_BALANCE = 1987654.32;

// Mock data
export const portfolioData: PortfolioDataIF = {
    id: 'main-portfolio',
    name: 'Main Portfolio',
    // totalValueUSD: 1987654.32,
    // availableBalance: 1987654.32,
    balances: {
        contract: CONTRACT_BALANCE,
        wallet: 0, // Will be replaced with real balance
    },
    unit: 'USD',
    tradingVolume: {
        daily: 215678.9,
        weekly: 1345678.23,
        biWeekly: 2456789.01,
        monthly: 5678901.23,
    },
    fees: {
        taker: 0.035,
        maker: 0.01,
    },
};

function portfolioReducer(
    state: PortfolioDataIF,
    action: any,
): PortfolioDataIF {
    switch (action.type) {
        case 'DEPOSIT':
            return {
                ...state,
                // availableBalance: state.availableBalance + action.amount,
                // totalValueUSD: state.totalValueUSD + action.amount,
                balances: {
                    contract: state.balances.contract + action.amount,
                    wallet: state.balances.wallet - action.amount,
                },
            };
        case 'WITHDRAW':
            return {
                ...state,
                // availableBalance: state.availableBalance - action.amount,
                // totalValueUSD: state.totalValueUSD - action.amount,
                balances: {
                    contract: state.balances.contract - action.amount,
                    wallet: state.balances.wallet + action.amount,
                },
            };
        case 'SEND':
            return {
                ...state,
                // availableBalance: state.availableBalance - action.amount,
                // totalValueUSD: state.totalValueUSD - action.amount,
                balances: {
                    contract: state.balances.contract - action.amount,
                    wallet: state.balances.wallet,
                },
            };
        case 'UPDATE_WALLET_BALANCE':
            return {
                ...state,
                balances: {
                    ...state.balances,
                    wallet: action.balance,
                },
            };
        default:
            return state;
    }
}

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const OTHER_FORMATTER = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
});

export function usePortfolioManager() {
    const {
        balance: walletBalance,
        isLoading: isBalanceLoading,
        error: balanceError,
        executeDeposit,
        validateAmount,
    } = useDepositService();

    // Create initial portfolio data with real wallet balance
    const initialPortfolioData = useMemo(
        () => ({
            ...portfolioData,
            balances: {
                contract: CONTRACT_BALANCE,
                wallet: walletBalance?.decimalized || 0,
            },
        }),
        [walletBalance],
    );

    const [portfolio, dispatch] = useReducer(
        portfolioReducer,
        initialPortfolioData,
    );

    // Update portfolio wallet balance when real balance changes
    useEffect(() => {
        if (walletBalance?.decimalized !== undefined) {
            dispatch({
                type: 'UPDATE_WALLET_BALANCE',
                balance: walletBalance.decimalized,
            });
        }
    }, [walletBalance]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<{
        isLoading: boolean;
        error: string | null;
    }>({
        isLoading: false,
        error: null,
    });

    // Memoized formatter function
    const formatCurrency = useCallback(
        (value: number, unit: string = 'USD') => {
            if (unit === 'USD') {
                return USD_FORMATTER.format(value);
            } else {
                return OTHER_FORMATTER.format(value) + ' ' + unit;
            }
        },
        [],
    );

    const selectedPortfolio = useMemo(() => portfolio, [portfolio]);

    const processDeposit = useCallback(
        async (amount: number) => {
            // Set processing state to true
            setIsProcessing(true);
            setStatus({ isLoading: true, error: null });

            try {
                // Execute the real Solana deposit transaction
                const result = await executeDeposit(amount);

                if (result.success) {
                    // Update portfolio balance using reducer only after successful transaction
                    dispatch({ type: 'DEPOSIT', amount });
                    setStatus({ isLoading: false, error: null });
                } else {
                    setStatus({
                        isLoading: false,
                        error: result.error || 'Deposit transaction failed',
                    });
                }
            } catch (error) {
                setStatus({
                    isLoading: false,
                    error: (error as Error).message,
                });
            } finally {
                setIsProcessing(false);
            }
        },
        [executeDeposit],
    );

    const processWithdraw = useCallback(
        (amount: number) => {
            if (amount > portfolio.balances.contract) {
                setStatus({ isLoading: false, error: 'Insufficient funds' });
                return;
            }

            // Set processing state to true
            setIsProcessing(true);
            setStatus({ isLoading: true, error: null });

            // Simulate network delay (2 seconds)
            setTimeout(() => {
                try {
                    // Update portfolio balance using reducer
                    dispatch({ type: 'WITHDRAW', amount });
                    setStatus({ isLoading: false, error: null });
                    setIsProcessing(false);
                } catch (error) {
                    setStatus({
                        isLoading: false,
                        error: (error as Error).message,
                    });
                    setIsProcessing(false);
                }
            }, 2000);
        },
        [portfolio.balances.contract],
    );

    const processSend = useCallback(
        (address: string, amount: number) => {
            if (!address || amount > portfolio.balances.contract) {
                setStatus({
                    isLoading: false,
                    error: !address ? 'Invalid address' : 'Insufficient funds',
                });
                return;
            }

            // Set processing state to true
            setIsProcessing(true);
            setStatus({ isLoading: true, error: null });

            // Simulate network delay (2 seconds)
            setTimeout(() => {
                try {
                    // Update portfolio balance using reducer
                    dispatch({ type: 'SEND', amount });
                    setStatus({ isLoading: false, error: null });
                    setIsProcessing(false);
                } catch (error) {
                    setStatus({
                        isLoading: false,
                        error: (error as Error).message,
                    });
                    setIsProcessing(false);
                }
            }, 2000);
        },
        [portfolio.balances.contract],
    );

    return {
        portfolio,
        selectedPortfolio,
        isProcessing: isProcessing || isBalanceLoading,
        status: balanceError
            ? { isLoading: false, error: balanceError }
            : status,
        formatCurrency,
        processDeposit,
        processWithdraw,
        processSend,
        validateAmount,
    };
}
