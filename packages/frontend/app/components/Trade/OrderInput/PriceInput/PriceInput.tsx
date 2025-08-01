import NumFormattedInput from '~/components/Inputs/NumFormattedInput/NumFormattedInput';
import useNumFormatter from '~/hooks/useNumFormatter';
import styles from './PriceInput.module.css';

interface PropsIF {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    ariaLabel?: string;
    showMidButton: boolean;
    markPx?: number;
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
        markPx,
    } = props;

    const { formatNumWithOnlyDecimals } = useNumFormatter();

    return (
        <div
            className={`${styles.priceInputContainer} ${showMidButton ? styles.chaseLimit : ''}`}
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
                    className={styles.midButton}
                    onClick={() =>
                        onChange(
                            markPx
                                ? formatNumWithOnlyDecimals(markPx, 6, true)
                                : '',
                        )
                    }
                >
                    Mid{' '}
                </button>
            )}
        </div>
    );
}
