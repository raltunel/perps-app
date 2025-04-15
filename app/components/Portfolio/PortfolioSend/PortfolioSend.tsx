import { useState, useCallback, memo, useMemo } from 'react';
import { MdClose } from 'react-icons/md';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Tooltip from '~/components/Tooltip/Tooltip';
import styles from './PortfolioSend.module.css';
import { useDebouncedCallback } from '~/hooks/useDebounce';
import { LuChevronDown } from 'react-icons/lu';

interface PortfolioSendProps {
    availableAmount: number;
    tokenType: string;
    networkFee: string;
    onSend: (address: string, amount: number) => void;
    onClose: () => void;
    isProcessing?: boolean;
}

function PortfolioSend({
    availableAmount,
    tokenType = 'USDe',
    networkFee = '$0.001',
    onSend,
    onClose,
    isProcessing = false,
}: PortfolioSendProps) {
    const [amount, setAmount] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedToken, setSelectedToken] = useState<string>(tokenType);

    const isValidNumberInput = useCallback((value: string) => {
        return value === '' || /^\d*\.?\d*$/.test(value);
    }, []);

    const validateAmount = useCallback((inputAmount: number, maxAmount: number) => {
        if (isNaN(inputAmount) || inputAmount <= 0) {
            return {
                isValid: false,
                message: 'Please enter a valid amount greater than 0',
            };
        }

        if (inputAmount > maxAmount) {
            return {
                isValid: false,
                message: `Amount exceeds available balance of ${formatCurrency(maxAmount)}`,
            };
        }

        return { isValid: true, message: null };
    }, []);

    const CURRENCY_FORMATTER = useMemo(() => new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }), []);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formatCurrency = useCallback((value: number, currency = selectedToken) => {
        return CURRENCY_FORMATTER.format(value);
    }, [CURRENCY_FORMATTER, selectedToken]);

    const debouncedAmountChange = useDebouncedCallback((newValue: string) => {
        if (isValidNumberInput(newValue)) {
            setAmount(newValue);
            setError(null);
        }
    }, 150);

    const debouncedAddressChange = useDebouncedCallback((newValue: string) => {
        setAddress(newValue);
        if (error && error.includes('address')) {
            setError(null);
        }
    }, 150);

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            debouncedAmountChange(newValue);
        },
        [debouncedAmountChange]
    );

    const handleAddressChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            debouncedAddressChange(newValue);
        },
        [debouncedAddressChange]
    );

    const handleMaxClick = useCallback(() => {
        setAmount(availableAmount.toString());
        setError(null);
    }, [availableAmount]);

    const handleSend = useCallback(() => {
        const sendAmount = parseFloat(amount);

        const validation = validateAmount(sendAmount, availableAmount);

        if (!validation.isValid) {
            setError(validation.message);
            return;
        }

        if (!address.trim()) {
            setError('Please enter a valid address');
            return;
        }

        onSend(address, sendAmount);
    }, [amount, address, availableAmount, onSend, validateAmount]);

    // Memoize info items to prevent recreating on each render
    const infoItems = useMemo(() => [
        {
            label: 'Available to send',
            value: formatCurrency(availableAmount),
            tooltip: 'The total amount you have available to send',
        },
        {
            label: 'Network Fee',
            value: networkFee,
            tooltip: 'Fee charged for processing the transaction',
        },
    ], [availableAmount, networkFee, formatCurrency]);

    // Memoize button disabled state
    const isButtonDisabled = useMemo(() => 
        isProcessing || 
        !amount ||
        !address ||
        parseFloat(amount) <= 0 ||
        parseFloat(amount) > availableAmount
    , [isProcessing, amount, address, availableAmount]);

    return (
        <div className={styles.container}>
            <header>
                <span />
                <h3>Send</h3>
                <MdClose onClick={onClose} />
            </header>
            <div className={styles.textContent}>
                <h4>Send {selectedToken} on Fogo</h4>
                <p>Send tokens to another address on Fogo.</p>
            </div>

            <div className={styles.inputContainer} >
                <input
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    aria-label="address input"
                    placeholder="Enter address..."
                    disabled={isProcessing}
                />
            </div>

            <div className={styles.inputContainer} >
                <div className={styles.tokenSelector}>
                    <div>{selectedToken}</div>
                    <LuChevronDown size={22} />
                </div>
            </div>

            <div className={styles.inputContainer} style={{ position: 'relative' }}>
                <h6>Amount</h6>
                <input
                    type="text"
                    value={amount}
                    onChange={handleInputChange}
                    aria-label="amount input"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter amount"
                    min="0"
                    step="any"
                    disabled={isProcessing}
                />
                <button 
                    onClick={handleMaxClick}
                    disabled={isProcessing}
                >
                    Max
                </button>
                {error && <div className={styles.error}>{error}</div>}
            </div>

            <div className={styles.contentContainer}>
                {infoItems.map((info, idx) => (
                    <div className={styles.infoRow} key={idx}>
                        <div className={styles.infoLabel}>
                            {info.label}
                            {info?.tooltip && (
                                <Tooltip
                                    content={info?.tooltip}
                                    position="right"
                                >
                                    <AiOutlineQuestionCircle size={13} />
                                </Tooltip>
                            )}
                        </div>
                        <div className={styles.infoValue}>{info.value}</div>
                    </div>
                ))}
            </div>
            <button
                className={styles.actionButton}
                onClick={handleSend}
                disabled={isButtonDisabled}
            >
                {isProcessing ? 'Processing...' : 'Send'}
            </button>
        </div>
    );
}

// Export memoized component
export default memo(PortfolioSend);