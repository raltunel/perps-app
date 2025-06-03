import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';
import useNumFormatter from '~/hooks/useNumFormatter';
import type { OrderBookMode } from '~/utils/orderbook/OrderBookIFs';
import styles from './SizeInput.module.css';

interface PropsIF {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    ariaLabel?: string;
    useTotalSize: boolean;
    symbol: string;
    selectedMode: OrderBookMode;
    setSelectedMode: React.Dispatch<React.SetStateAction<OrderBookMode>>;
}

const SizeInput: React.FC<PropsIF> = React.memo((props) => {
    const {
        value,
        onChange,
        onBlur,
        onKeyDown,
        className,
        ariaLabel,
        useTotalSize,
        symbol,
        selectedMode,
        setSelectedMode,
    } = props;

    const {
        inputRegex,
        parseFormattedWithOnlyDecimals,
        formatNumWithOnlyDecimals,
        getPrecisionFromNumber,
    } = useNumFormatter();

    const valueNum = useRef<number>(0);
    const valueRef = useRef<string>(value);
    valueRef.current = value;

    // Memoized input change handler
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            if (inputRegex.test(newValue) && newValue.length <= 12) {
                onChange(event);
                valueNum.current = parseFormattedWithOnlyDecimals(newValue);
            }
        },
        [inputRegex, onChange, parseFormattedWithOnlyDecimals],
    );

    // Memoized ComboBox options
    const comboBoxOptions = useMemo(
        () => [symbol.toUpperCase(), 'USD'],
        [symbol],
    );

    // Memoized ComboBox onChange handler
    const handleComboBoxChange = useCallback(
        (val: string) => {
            setSelectedMode(val === symbol.toUpperCase() ? 'symbol' : 'usd');
        },
        [setSelectedMode, symbol],
    );

    useEffect(() => {
        valueNum.current = parseFormattedWithOnlyDecimals(valueRef.current);
    }, [parseFormattedWithOnlyDecimals, valueRef.current]);

    useEffect(() => {
        const precision = getPrecisionFromNumber(valueNum.current);
        onChange(formatNumWithOnlyDecimals(valueNum.current, precision));
        // Only run when formatter functions or onChange change
    }, [formatNumWithOnlyDecimals, getPrecisionFromNumber, onChange]);

    return (
        <div className={styles.sizeInputContainer}>
            <span>{useTotalSize ? 'Total Size' : 'Size'}</span>
            <input
                type='text'
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                className={className}
                aria-label={ariaLabel}
                inputMode='numeric'
                pattern='[0-9]*'
                placeholder='Enter Size'
            />
            <button className={styles.tokenButton}>
                <ComboBox
                    value={
                        selectedMode === 'symbol' ? symbol.toUpperCase() : 'USD'
                    }
                    options={comboBoxOptions}
                    onChange={handleComboBoxChange}
                />
            </button>
        </div>
    );
});

export default SizeInput;
