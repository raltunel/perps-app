import NumFormattedInput from '~/components/Inputs/NumFormattedInput/NumFormattedInput';
import styles from './PriceInput.module.css';

interface PropsIF {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    ariaLabel?: string;
    showMidButton: boolean;
    setMidPriceAsPriceInput: () => void;
    isMidModeActive: boolean;
    setIsMidModeActive: (value: boolean) => void;
    isModal?: boolean;
}
export default function PriceInput(props: PropsIF) {
    const {
        value,
        onChange,
        onBlur,
        onKeyDown,
        className,
        ariaLabel,
        showMidButton,
        setMidPriceAsPriceInput,
        isMidModeActive,
        setIsMidModeActive,
        isModal = false,
    } = props;

    return (
        <div
            className={`${styles.priceInputContainer}
             ${showMidButton ? styles.chaseLimit : ''}
             ${isModal ? styles.modalContainer : ''}

              `}
        >
            <span>Price</span>
            <NumFormattedInput
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                className={className}
                aria-label={ariaLabel}
                placeholder='Enter Price'
            />
            {showMidButton && (
                <button
                    className={`${styles.midButton} ${isMidModeActive ? styles.midButtonActive : ''}`}
                    onClick={() => {
                        if (!isMidModeActive) {
                            setMidPriceAsPriceInput();
                            setIsMidModeActive(true);
                        } else {
                            setIsMidModeActive(false);
                        }
                    }}
                >
                    Mid
                </button>
            )}
        </div>
    );
}
