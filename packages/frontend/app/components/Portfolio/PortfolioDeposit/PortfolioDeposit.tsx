import { useState, useCallback, memo, useMemo, useEffect } from 'react';
import styles from './PortfolioDeposit.module.css';
import Tooltip from '~/components/Tooltip/Tooltip';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
// import { useDebouncedCallback } from '~/hooks/useDebounce';
import TokenDropdown, {
    AVAILABLE_TOKENS,
    type Token,
} from '~/components/TokenDropdown/TokenDropdown';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import FogoLogo from '../../../assets/tokens/FOGO.svg';
import { useNotificationStore } from '~/stores/NotificationStore';
import useNumFormatter from '~/hooks/useNumFormatter';

interface propsIF {
    portfolio: {
        id: string;
        name: string;
        availableBalance: number;
        unit?: string;
    };
    onDeposit: (amount: number) => void | Promise<any>;
    onClose: () => void;
    isProcessing?: boolean;
}

function PortfolioDeposit(props: propsIF) {
    const { portfolio, onDeposit, isProcessing = false } = props;
    const notificationStore = useNotificationStore();
    const { formatNum } = useNumFormatter();

    const [error, setError] = useState<string | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<
        'idle' | 'pending' | 'success' | 'failed'
    >('idle');
    const [selectedToken, setSelectedToken] = useState<Token>(
        AVAILABLE_TOKENS.find(
            (token) => token.symbol === (portfolio.unit || 'USDe'),
        ) || AVAILABLE_TOKENS[0],
    );

    // Available balance for this portfolio
    const availableBalance = portfolio.availableBalance;

    const [amt, setAmt] = useState({
        rawValue: '',
        dbdValue: '',
    });

    const DEBOUNCE_TIME_MS = 1500;

    useEffect(() => {
        const timeoutId = setTimeout(
            () => {
                setAmt({
                    ...amt,
                    dbdValue: amt.rawValue,
                });
            },
            amt.rawValue === '' ? 0 : DEBOUNCE_TIME_MS,
        );

        return () => clearTimeout(timeoutId);
    }, [amt.rawValue]);

    const handleMaxClick = useCallback(() => {
        setError(null);
    }, [availableBalance]);

    const handleDeposit = useCallback(async () => {
        const depositAmount = parseFloat(amt.rawValue);
        setError(null);
        setTransactionStatus('pending');

        if (!depositAmount || isNaN(depositAmount)) {
            setError('Please enter a valid amount');
            setTransactionStatus('idle');
            return;
        }

        if (depositAmount <= 0) {
            setError('Amount must be greater than 0');
            setTransactionStatus('idle');
            return;
        }

        // Check minimum deposit of $10
        if (depositAmount < 10) {
            setError('Minimum deposit amount is $10.00');
            setTransactionStatus('idle');
            return;
        }

        if (depositAmount > availableBalance) {
            setError(`Amount exceeds available balance of ${availableBalance}`);
            setTransactionStatus('idle');
            return;
        }

        try {
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(
                    () =>
                        reject(
                            new Error('Transaction timed out after 15 seconds'),
                        ),
                    15000,
                );
            });

            // Race between the deposit and the timeout
            const result = await Promise.race([
                onDeposit(depositAmount),
                timeoutPromise,
            ]);

            // Check if the result indicates failure
            if (result && result.success === false) {
                setTransactionStatus('failed');
                setError(result.error || 'Transaction failed');
            } else {
                setTransactionStatus('success');
                // clear form and state on success
                setAmt({
                    ...amt,
                    rawValue: '',
                });

                // Show success notification
                notificationStore.add({
                    title: 'Deposit Successful',
                    message: `Successfully deposited $${depositAmount.toFixed(2)} USD`,
                    icon: 'check',
                });

                // Close modal on success - notification will show after modal closes
                if (props.onClose) {
                    props.onClose();
                }
            }
        } catch (error) {
            setTransactionStatus('failed');
            setError(error instanceof Error ? error.message : 'Deposit failed');
        }
    }, [amt, availableBalance, onDeposit]);

    const handleTokenSelect = useCallback((token: Token) => {
        setSelectedToken(token);
    }, []);

    const USD_FORMATTER = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        [],
    );

    const OTHER_FORMATTER = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
            }),
        [],
    );

    const formatCurrency = useCallback(
        (value: number, unit: string) => {
            if (unit === 'USD') {
                return USD_FORMATTER.format(value);
            }
            return `${OTHER_FORMATTER.format(value)} ${unit}`;
        },
        [USD_FORMATTER, OTHER_FORMATTER],
    );

    // Memoize info items to prevent recreating on each render
    const infoItems = useMemo(() => {
        // Check if this is a USD-related token
        const isUSDToken =
            selectedToken.symbol === 'USD' ||
            selectedToken.symbol === 'USDe' ||
            selectedToken.symbol === 'fUSD' ||
            portfolio.unit === 'USD';

        return [
            {
                label: 'Available to deposit',
                value: isUSDToken
                    ? formatNum(availableBalance, 2, true, true) // Use app formatter for USD values
                    : formatCurrency(availableBalance, selectedToken.symbol),
                tooltip:
                    'The maximum amount you can deposit based on your balance',
            },
            {
                label: 'Network Fee',
                value:
                    selectedToken.symbol === 'BTC' ? '0.00001 BTC' : '$0.001',
                tooltip: 'Fee charged for processing the deposit transaction',
            },
        ];
    }, [
        availableBalance,
        selectedToken.symbol,
        portfolio.unit,
        formatCurrency,
        formatNum,
    ]);

    // fn to determine if an arbirtary string is a number in valid range
    function validateAmount(a: string): boolean {
        const asFloat: number = parseFloat(a);
        return !isNaN(asFloat) && asFloat > 0 && asFloat < 10;
    }

    // Check if amount is below minimum
    const isBelowMinimum = useMemo(() => {
        return {
            raw: validateAmount(amt.rawValue),
            dbd: validateAmount(amt.dbdValue),
        };
    }, [amt]);

    const isButtonDisabled = useMemo(
        () =>
            isProcessing ||
            !amt.rawValue ||
            parseFloat(amt.rawValue) <= 0 ||
            parseFloat(amt.rawValue) > availableBalance,
        [isProcessing, amt.rawValue, availableBalance],
    );

    return (
        <div className={styles.container}>
            <div className={styles.textContent}>
                <img src={FogoLogo} alt='Fogo Chain Logo' width='64px' />
                <h4>Deposit {selectedToken.symbol} from Fogo</h4>
            </div>

            <TokenDropdown
                selectedToken={selectedToken.symbol}
                onTokenSelect={handleTokenSelect}
                disabled={isProcessing}
                className={styles.tokenDropdown}
            />

            <div className={styles.inputContainer}>
                <h6>
                    Amount{' '}
                    {isBelowMinimum.dbd && (
                        <span className={styles.minWarning}>(Min: $10)</span>
                    )}
                </h6>
                <input
                    type='text'
                    value={amt.rawValue}
                    onChange={(e) =>
                        setAmt({
                            ...amt,
                            rawValue: e.currentTarget.value,
                        })
                    }
                    aria-label='deposit input'
                    inputMode='numeric'
                    onInput={(e) => {
                        // prevent input of characters other than numerals and periods
                        e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9.]/g,
                            '',
                        );
                    }}
                    placeholder='Enter amount (min $10)'
                    min='0'
                    step='any'
                    disabled={isProcessing}
                />
                <button
                    onClick={handleMaxClick}
                    disabled={isProcessing}
                    className={styles.maxButton}
                >
                    Max
                </button>
                {error && <div className={styles.error}>{error}</div>}
                {transactionStatus === 'failed' && !error && (
                    <div className={styles.error}>
                        Transaction failed. Please try again.
                    </div>
                )}
            </div>

            <div className={styles.contentContainer}>
                {infoItems.map((info, idx) => (
                    <div className={styles.infoRow} key={idx}>
                        <div className={styles.infoLabel}>
                            {info.label}
                            {info?.tooltip && (
                                <Tooltip
                                    content={info?.tooltip}
                                    position='right'
                                >
                                    <AiOutlineQuestionCircle size={13} />
                                </Tooltip>
                            )}
                        </div>
                        <div className={styles.infoValue}>{info.value}</div>
                    </div>
                ))}
            </div>

            <SimpleButton
                bg='accent1'
                onClick={handleDeposit}
                disabled={isButtonDisabled || isBelowMinimum.raw}
            >
                {transactionStatus === 'pending'
                    ? 'Confirming Transaction...'
                    : isProcessing
                      ? 'Processing...'
                      : 'Deposit'}
            </SimpleButton>
        </div>
    );
}

// Export memoized component
export default memo(PortfolioDeposit);
