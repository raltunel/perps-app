import { FaChevronDown } from 'react-icons/fa';
import styles from './SizeInput.module.css';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useEffect, useMemo, useRef } from 'react';
import { useAppSettings } from '~/stores/AppSettingsStore';

interface PropsIF {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    ariaLabel?: string;
    useTotalSize: boolean;
    symbol?: string;
}
export default function SizeInput(props: PropsIF) {
    const {
        value,
        onChange,
        onBlur,
        onKeyDown,
        className,
        ariaLabel,
        useTotalSize,
        symbol,
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (inputRegex.test(newValue) && newValue.length <= 12) {
            onChange(event);
            valueNum.current = parseFormattedWithOnlyDecimals(newValue);
        }
    };

    useEffect(() => {
        valueNum.current = parseFormattedWithOnlyDecimals(valueRef.current);
    }, [valueRef.current]);

    useEffect(() => {
        const precision = getPrecisionFromNumber(valueNum.current);
        onChange(formatNumWithOnlyDecimals(valueNum.current, precision));
    }, [formatNumWithOnlyDecimals]);

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
                {symbol ? symbol : 'ETH'} <FaChevronDown />
            </button>
        </div>
    );
}
