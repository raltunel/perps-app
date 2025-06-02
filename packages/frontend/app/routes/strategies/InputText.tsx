import type { ChangeEvent } from 'react';
import styles from './InputText.module.css';
import type { textInputIF } from './createStrategy';

interface propsIF {
    data: textInputIF;
    handleChange: (text: string) => void;
    initialVal?: string;
}

export default function InputText(props: propsIF) {
    const {
        data,
        handleChange,
        initialVal = '',
    } = props;

    const idForDOM: string = 'CREATE_STRATEGY_'
        + data.label.toUpperCase().replace(' ', '_');

    return (
        <div className={styles.text_input}>
            <label htmlFor={idForDOM}>{data.label}</label>
            <input
                type='text'
                id={idForDOM}
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
