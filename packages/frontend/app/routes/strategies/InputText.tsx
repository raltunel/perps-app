import styles from './InputText.module.css';

interface propsIF {
    label: string;
    inputId: string;
    initialVal?: string;
    placeholder?: string;
}

export default function InputText(props: propsIF) {
    const { label, inputId, initialVal = '', placeholder = '' } = props;

    return (
        <div className={styles.text_input}>
            <label htmlFor={inputId}>{label}</label>
            <input
                type='text'
                defaultValue={initialVal}
                placeholder={placeholder}
            />
        </div>
    );
}
