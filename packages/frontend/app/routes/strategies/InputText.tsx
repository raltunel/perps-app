import { useState, type ChangeEvent } from 'react';
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

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selection, setSelection] = useState<string>(data.input[0]);

    return (
        <div className={styles.text_input}>
            <label htmlFor={idForDOM}>{data.label}</label>
            { typeof data.input === 'string' &&
                <input
                    type='text'
                    id={idForDOM}
                    defaultValue={initialVal}
                    placeholder={data.input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e.currentTarget.value)
                    }
                />
            }
            { Array.isArray(data.input) &&
                <div className={styles.dropdown}>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {selection}
                    </button>
                    { isOpen &&
                        <ul>
                            { data.input.map((inp: string) => (
                                <li
                                    key={inp}
                                    onClick={() => {
                                        setSelection(inp);
                                        setIsOpen(false);
                                    }}
                                >
                                    {inp}
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            }
            <p>{data.blurb}</p>
        </div>
    );
}
