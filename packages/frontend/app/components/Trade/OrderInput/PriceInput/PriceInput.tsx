import { useEffect, useRef } from 'react';
import useNumFormatter from '~/hooks/useNumFormatter';
import styles from './PriceInput.module.css';
import NumFormattedInput from '~/components/Inputs/NumFormattedInput/NumFormattedInput';

interface PropsIF {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    ariaLabel?: string;
    showMidButton: boolean;
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
    } = props;

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
            {/* <input
                type='text'
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                className={className}
                aria-label={ariaLabel}
                inputMode='numeric'
                pattern='[0-9]*'
                placeholder='Enter Price'
            /> */}
            {showMidButton && (
                <button className={styles.midButton}>Mid </button>
            )}
        </div>
    );
}
