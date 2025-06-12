import { useCallback, useEffect, useRef } from 'react';
import useNumFormatter from '~/hooks/useNumFormatter';
import styles from './NumFormattedInput.module.css';

interface NumFormattedInputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    ariaLabel?: string;
    placeholder?: string;
}

const NumFormattedInput: React.FC<NumFormattedInputProps> = ({
    value,
    onChange,
    onBlur,
    onKeyDown,
    className,
    ariaLabel,
    placeholder,
}) => {
    const {
        inputRegex,
        parseFormattedWithOnlyDecimals,
        formatNumWithOnlyDecimals,
        getPrecisionFromNumber,
    } = useNumFormatter();

    const valueNum = useRef<number>(0);

    useEffect(() => {
        const str = formatNumWithOnlyDecimals(valueNum.current);
        onChange(str);
    }, [inputRegex]);

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

    useEffect(() => {
        valueNum.current = parseFormattedWithOnlyDecimals(value);
    }, [parseFormattedWithOnlyDecimals, value]);

    return (
        <>
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
                placeholder={placeholder}
            />
        </>
    );
};

export default NumFormattedInput;
