import { useState, useCallback, useMemo, useReducer } from 'react';

// Define the types we need
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

type ModalContent = 'deposit' | 'withdraw' | 'send' | null;

// Define reducer for portfolio operations
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

// Pre-define formatters for better performance
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
    // Portfolio data state with reducer
    const [portfolio, dispatch] = useReducer(portfolioReducer, portfolioData);

    // Processing state for operations
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState({ isLoading: false, error: null });

    // Combined modal state
    const [modalState, setModalState] = useState({
        isOpen: false,
        content: null as ModalContent,
        selectedPortfolioId: null as string | null,
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

    // Get the selected portfolio - memoized
    const selectedPortfolio = useMemo(
        () => (modalState.selectedPortfolioId && portfolio ? portfolio : null),
        [portfolio, modalState.selectedPortfolioId],
    );

    // Modal management - optimized
    const openModal = useCallback(
        (content: ModalContent) => {
            setModalState({
                isOpen: true,
                content,
                selectedPortfolioId: portfolio.id,
            });
        },
        [portfolio.id],
    );

    const closeModal = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            isOpen: false,
        }));

        // Clear content after animation completes
        setTimeout(() => {
            setModalState({
                isOpen: false,
                content: null,
                selectedPortfolioId: null,
            });
            setIsProcessing(false); // Reset processing state when modal is fully closed
        }, 300);
    }, []);

    // Portfolio operations with optimized state management
    const processDeposit = useCallback(
        (amount: number) => {
            // Set processing state to true
            setIsProcessing(true);
            setStatus({ isLoading: true, error: null });

            // Simulate network delay (2 seconds)
            setTimeout(() => {
                try {
                    // Update portfolio balance using reducer
                    dispatch({ type: 'DEPOSIT', amount });
                    setStatus({ isLoading: false, error: null });
                    // Close modal (processing state will be reset in closeModal)
                    closeModal();
                } catch (error) {
                    setStatus({
                        isLoading: false,
                        error: (error as Error).message,
                    });
                }
            }, 2000);
        },
        [closeModal],
    );

    const processWithdraw = useCallback(
        (amount: number) => {
            // Basic validation
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
                    // Close modal
                    closeModal();
                } catch (error) {
                    setStatus({
                        isLoading: false,
                        error: (error as Error).message,
                    });
                }
            }, 2000);
        },
        [portfolio.availableBalance, closeModal],
    );

    const processSend = useCallback(
        (address: string, amount: number) => {
            // Basic validation
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
                    // Close modal
                    closeModal();
                } catch (error) {
                    setStatus({
                        isLoading: false,
                        error: (error as Error).message,
                    });
                }
            }, 2000);
        },
        [portfolio.availableBalance, closeModal],
    );

    return {
        portfolio,
        selectedPortfolio,
        isProcessing,
        status,
        modalState,
        formatCurrency,
        openModal,
        closeModal,
        processDeposit,
        processWithdraw,
        processSend,
    };
}
