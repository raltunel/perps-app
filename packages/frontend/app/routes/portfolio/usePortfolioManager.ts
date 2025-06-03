import { useCallback, useMemo, useReducer, useState } from 'react';

export interface PortfolioData {
    id: string;
    name: string;
    totalValueUSD: number;
    availableBalance: number;
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

// Mock data
export const portfolioData: PortfolioData = {
    id: 'main-portfolio',
    name: 'Main Portfolio',
    totalValueUSD: 1987654.32,
    availableBalance: 1987654.32,
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

function portfolioReducer(state: PortfolioData, action: any): PortfolioData {
    switch (action.type) {
        case 'DEPOSIT':
            return {
                ...state,
                availableBalance: state.availableBalance + action.amount,
                totalValueUSD: state.totalValueUSD + action.amount,
            };
        case 'WITHDRAW':
        case 'SEND':
            return {
                ...state,
                availableBalance: state.availableBalance - action.amount,
                totalValueUSD: state.totalValueUSD - action.amount,
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
    const [portfolio, dispatch] = useReducer(portfolioReducer, portfolioData);

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

    const processDeposit = useCallback((amount: number) => {
        // Set processing state to true
        setIsProcessing(true);
        setStatus({ isLoading: true, error: null });

        // Simulate network delay (2 seconds)
        setTimeout(() => {
            try {
                // Update portfolio balance using reducer
                dispatch({ type: 'DEPOSIT', amount });
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
    }, []);

    const processWithdraw = useCallback(
        (amount: number) => {
            if (amount > portfolio.availableBalance) {
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
        [portfolio.availableBalance],
    );

    const processSend = useCallback(
        (address: string, amount: number) => {
            if (!address || amount > portfolio.availableBalance) {
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
        [portfolio.availableBalance],
    );

    return {
        portfolio,
        selectedPortfolio,
        isProcessing,
        status,
        formatCurrency,
        processDeposit,
        processWithdraw,
        processSend,
    };
}
