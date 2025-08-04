import { memo, useCallback, useMemo, useState } from 'react';
import { LuCircleHelp } from 'react-icons/lu';
import NumFormattedInput from '~/components/Inputs/NumFormattedInput/NumFormattedInput';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import Tooltip from '~/components/Tooltip/Tooltip';
import useDebounce from '~/hooks/useDebounce';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useNotificationStore } from '~/stores/NotificationStore';
import { blockExplorer } from '~/utils/Constants';
import FogoLogo from '../../../assets/tokens/FOGO.svg';
import styles from './PortfolioWithdraw.module.css';

interface propsIF {
    portfolio: {
        id: string;
        name: string;
        availableBalance: number;
        unit?: string;
    };
    onWithdraw: (amount?: number | undefined) => void;
    onClose: () => void;
    isProcessing?: boolean;
}

function PortfolioWithdraw({
    portfolio,
    onWithdraw,
    onClose,
    isProcessing = false,
}: propsIF) {
    const notificationStore = useNotificationStore();
    const [rawInputString, setRawInputString] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<
        'idle' | 'pending' | 'success' | 'failed'
    >('idle');

    const {
        formatNum,
        parseFormattedWithOnlyDecimals,
        formatNumWithOnlyDecimals,
        activeDecimalSeparator,
    } = useNumFormatter();

    const withdrawInputNum = parseFormattedWithOnlyDecimals(rawInputString);

    const isSizeInvalid: boolean =
        !isNaN(withdrawInputNum) &&
        withdrawInputNum > 0 &&
        withdrawInputNum < 1;

    // debounced invalid state
    const isSizeInvalidDebounced = useDebounce<boolean>(isSizeInvalid, 500);

    const showInvalidSizeWarning = isSizeInvalid
        ? isSizeInvalidDebounced
        : false;

    const [maxActive, setMaxActive] = useState(false);

    const withdrawAmount = parseFormattedWithOnlyDecimals(rawInputString);

    const validateAmount = useCallback(
        (amount: number, maxAmount: number) => {
            if (!amount || isNaN(amount)) {
                return {
                    isValid: false,
                    message: 'Please enter a valid amount',
                };
            }

            if (amount <= 0) {
                return {
                    isValid: false,
                    message: 'Amount must be greater than 0',
                };
            }

            if (amount > maxAmount && !maxActive) {
                return {
                    isValid: false,
                    message: `Amount exceeds available balance of ${maxAmount}`,
                };
            }

            return {
                isValid: true,
                message: null,
            };
        },
        [maxActive],
    );

    const handleMaxClick = useCallback(() => {
        setRawInputString(
            '$' +
                formatNumWithOnlyDecimals(portfolio.availableBalance, 2, false),
        );
        setMaxActive(true);
    }, [portfolio.availableBalance]);

    const handleWithdraw = useCallback(async () => {
        setError(null);
        setTransactionStatus('pending');

        const validation = validateAmount(
            withdrawAmount,
            portfolio.availableBalance,
        );

        if (!validation.isValid) {
            setError(validation.message);
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

            // Race between the withdraw and the timeout
            const result = await Promise.race([
                maxActive ? onWithdraw() : onWithdraw(withdrawAmount),
                timeoutPromise,
            ]);

            // Check if the result indicates failure
            if (result && result.success === false) {
                setTransactionStatus('failed');
                setError(result.error || 'Transaction failed');
                notificationStore.add({
                    title: 'Withdrawal Failed',
                    message: result.error || 'Transaction failed',
                    icon: 'error',
                    removeAfter: 15000,
                    txLink: result.signature
                        ? `${blockExplorer}/tx/${result.signature}`
                        : undefined,
                });
            } else {
                setTransactionStatus('success');

                // Show success notification
                notificationStore.add({
                    title: 'Withdrawal Successful',
                    message: `Successfully withdrew ${formatNum(withdrawAmount, 2, true, true)} fUSD`,
                    icon: 'check',
                    txLink: result.signature
                        ? `${blockExplorer}/tx/${result.signature}`
                        : undefined,
                    removeAfter: 10000,
                });

                // Close modal on success - notification will show after modal closes
                if (onClose) {
                    onClose();
                }
            }
        } catch (error) {
            setTransactionStatus('failed');
            setError(
                error instanceof Error ? error.message : 'Withdrawal failed',
            );
        }
    }, [
        withdrawAmount,
        portfolio.availableBalance,
        onWithdraw,
        validateAmount,
        onClose,
        notificationStore,
    ]);

    // Memoize info items to prevent recreating on each render
    const infoItems = useMemo(
        () => [
            {
                label: 'Available to withdraw',
                value: !isNaN(portfolio.availableBalance)
                    ? formatNum(portfolio.availableBalance, 2, true, true)
                    : '-',
                tooltip:
                    'The total amount you have available to withdraw from your portfolio',
            },
        ],
        [portfolio.availableBalance, formatNum],
    );

    // Memoize button disabled state calculation
    const isButtonDisabled = useMemo(
        () =>
            isProcessing ||
            !rawInputString ||
            isNaN(withdrawInputNum) ||
            withdrawInputNum <= 0 ||
            (!maxActive && withdrawInputNum > portfolio.availableBalance),
        [isProcessing, rawInputString, portfolio.availableBalance, maxActive],
    );

    return (
        <div className={styles.container}>
            <div className={styles.textContent}>
                <img src={FogoLogo} alt='Fogo Chain Logo' width='64px' />
                {/* <h4>Withdraw {unitValue} to Fogo</h4> */}
                <h4>Withdraw fUSD to Fogo</h4>
                <div>
                    <p>fUSD will be sent to your address.</p>
                </div>
            </div>

            <div className={styles.inputContainer}>
                <h6>
                    Amount{' '}
                    {showInvalidSizeWarning && (
                        <span className={styles.minWarning}>(Min: $1)</span>
                    )}
                </h6>
                <NumFormattedInput
                    placeholder='Enter amount (min $1)'
                    value={rawInputString}
                    onChange={(
                        event: string | React.ChangeEvent<HTMLInputElement>,
                    ) => {
                        if (typeof event === 'string') {
                            setRawInputString(event);
                            setMaxActive(false);
                        } else {
                            setRawInputString(event.target.value);
                            setMaxActive(false);
                        }
                    }}
                    autoFocus
                    aria-label='withdraw input'
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter' && !isButtonDisabled) {
                            handleWithdraw();
                        }
                    }}
                    inputRegexOverride={RegExp(
                        `^\\$?\\d*(?:\\${activeDecimalSeparator}\\d*)?$`,
                    )}
                />
                <button onClick={handleMaxClick} disabled={isProcessing}>
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
                                    <LuCircleHelp size={12} />
                                </Tooltip>
                            )}
                        </div>
                        <div className={styles.infoValue}>{info.value}</div>
                    </div>
                ))}
            </div>

            <SimpleButton
                bg='accent1'
                onClick={handleWithdraw}
                disabled={isButtonDisabled || isSizeInvalid}
            >
                {transactionStatus === 'pending'
                    ? 'Confirming Transaction...'
                    : isProcessing
                      ? 'Processing...'
                      : 'Withdraw'}
            </SimpleButton>
        </div>
    );
}

export default memo(PortfolioWithdraw);
