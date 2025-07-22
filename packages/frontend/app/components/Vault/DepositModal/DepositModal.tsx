import { useState, useCallback, useMemo } from 'react';
import styles from './DepositModal.module.css';
import Tooltip from '~/components/Tooltip/Tooltip';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { LuChevronDown } from 'react-icons/lu';
import { useVaultManager } from '~/routes/vaults/useVaultManager';
import { useDepositService } from '~/hooks/useDepositService';

interface DepositModalProps {
    vault: {
        id: string;
        name: string;
        totalCapacity: number;
        totalDeposited: number;
        unit?: string;
    };
    onDeposit: (amount: number) => void;
    onClose: () => void;
}

export default function DepositModal({
    vault,
    onDeposit,
    // onClose,
}: DepositModalProps) {
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [selectedToken] = useState('USDe');
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        formatCurrency,
        validateAmount: validateVaultAmount,
        // isValidNumberInput,
        getAvailableCapacity,
    } = useVaultManager();

    const {
        balance: walletBalance,
        validateAmount: validateDepositAmount,
        executeDeposit,
        isLoading: isDepositLoading,
    } = useDepositService();

    // Use the unit from the vault or default to USD
    const unitValue = vault.unit || 'USD';

    // Get available capacity for this vault
    const availableCapacity = getAvailableCapacity(vault.id);

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            setAmount(newValue);
            setError(null);
        },
        [],
    );

    // Calculate max available amount (minimum of vault capacity and wallet balance)
    const maxAvailableAmount = useMemo(() => {
        const userWalletBalance = walletBalance?.decimalized || 0;
        return Math.min(availableCapacity, userWalletBalance);
    }, [availableCapacity, walletBalance]);

    const handleMaxClick = useCallback(() => {
        setAmount(maxAvailableAmount.toString());
        setError(null);
    }, [maxAvailableAmount]);

    const handleDeposit = useCallback(async () => {
        const depositAmount = parseFloat(amount);
        setError(null);
        setIsProcessing(true);

        try {
            // Validate minimum deposit amount ($10)
            const depositValidation = validateDepositAmount(depositAmount);
            if (!depositValidation.isValid) {
                setError(depositValidation.message || 'Invalid deposit amount');
                return;
            }

            // Validate against vault capacity and wallet balance
            const vaultValidation = validateVaultAmount(
                depositAmount,
                maxAvailableAmount,
            );
            if (!vaultValidation.isValid) {
                setError(vaultValidation.message || 'Invalid amount');
                return;
            }

            // Execute the Solana transaction
            const result = await executeDeposit(depositAmount);

            if (result.success) {
                // Update vault state through parent component
                onDeposit(depositAmount);
            } else {
                setError(result.error || 'Deposit failed');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Deposit failed');
        } finally {
            setIsProcessing(false);
        }
    }, [
        amount,
        maxAvailableAmount,
        validateDepositAmount,
        validateVaultAmount,
        executeDeposit,
        onDeposit,
    ]);

    const infoItems = [
        {
            label: 'Available to deposit',
            value: formatCurrency(maxAvailableAmount, unitValue),
            tooltip:
                'The maximum amount you can deposit based on vault capacity and wallet balance',
        },
        {
            label: 'Wallet balance',
            value: formatCurrency(walletBalance?.decimalized || 0, unitValue),
            tooltip: 'Your current wallet balance',
        },
        {
            label: 'Network Fee',
            value: 'Sponsored by Fogo',
            tooltip: 'Transaction fees are sponsored by Fogo',
        },
    ];

    // Enhanced button state logic
    const isButtonDisabled = useMemo(() => {
        if (!amount || isProcessing || isDepositLoading) return true;

        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) return true;

        // Check minimum deposit requirement
        const depositValidation = validateDepositAmount(depositAmount);
        if (!depositValidation.isValid) return true;

        // Check against available capacity and wallet balance
        if (depositAmount > maxAvailableAmount) return true;

        return false;
    }, [
        amount,
        isProcessing,
        isDepositLoading,
        validateDepositAmount,
        maxAvailableAmount,
    ]);

    // Enhanced button text logic
    const buttonText = useMemo(() => {
        if (isProcessing) return 'Processing...';
        if (isDepositLoading) return 'Loading...';

        if (amount) {
            const depositAmount = parseFloat(amount);
            if (!isNaN(depositAmount) && depositAmount > 0) {
                const depositValidation = validateDepositAmount(depositAmount);
                if (!depositValidation.isValid) {
                    return depositValidation.message || 'Invalid Amount';
                }
            }
        }

        return 'Deposit';
    }, [amount, isProcessing, isDepositLoading, validateDepositAmount]);

    return (
        <div className={styles.container}>
            {/* <header>
                <span />
                <h3>Deposit</h3>
                <MdClose onClick={onClose} />
            </header> */}
            <div className={styles.textContent}>
                <h4>
                    Deposit {unitValue} to {vault.name}
                </h4>
                <p>
                    Deposit {unitValue} to earn yield from the {vault.name}.
                    Deposits will be available for withdrawal after the next
                    epoch.
                </p>
            </div>

            <div className={styles.dropdownContainer}>
                <span>{selectedToken}</span>
                <LuChevronDown size={22} />
            </div>

            <div className={styles.inputContainer}>
                <h6>Amount</h6>
                <input
                    type='text'
                    value={amount}
                    onChange={handleInputChange}
                    aria-label='deposit input'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    placeholder='Enter amount'
                    min='0'
                    step='any'
                />
                <button onClick={handleMaxClick} className={styles.maxButton}>
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
            <button
                className={styles.actionButton}
                onClick={handleDeposit}
                disabled={isButtonDisabled}
            >
                {buttonText}
            </button>
        </div>
    );
}
