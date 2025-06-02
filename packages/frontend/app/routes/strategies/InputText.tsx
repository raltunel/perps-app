import type { ChangeEvent } from 'react';
import styles from './InputText.module.css';
import type { textInputIF } from './createStrategy';

interface propsIF {
    data: textInputIF;
    inputId: string;
    handleChange: (text: string) => void;
    initialVal?: string;
}

export default function InputText(props: propsIF) {
    const {
        data,
        inputId,
        handleChange,
        initialVal = '',
    } = props;

    return (
        <div className={styles.text_input}>
            <label htmlFor={inputId}>{data.label}</label>
            <input
                type='text'
                defaultValue={initialVal}
                placeholder={data.placeholder}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(e.currentTarget.value)
                }
            />
            <p>{data.blurb}</p>
        </div>
    );
}
