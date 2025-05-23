import type { ChangeEvent } from 'react';
import styles from './InputText.module.css';

interface propsIF {
    label: string;
    inputId: string;
    handleChange: (text: string) => void;
    initialVal?: string;
    placeholder?: string;
}

export default function InputText(props: propsIF) {
    const {
        label,
        inputId,
        handleChange,
        initialVal = '',
        placeholder = '',
    } = props;

    return (
        <div className={styles.text_input}>
            <label htmlFor={inputId}>{label}</label>
            <input
                type='text'
                defaultValue={initialVal}
                placeholder={placeholder}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(e.currentTarget.value)
                }
            />
        </div>
    );
}
