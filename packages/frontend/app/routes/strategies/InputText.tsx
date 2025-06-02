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
                <div>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        Hi there!
                    </button>
                    { isOpen &&
                        <ol>
                            {data.input.map(
                                (inp: string) => (<li>
                                    {inp}
                                </li>)
                            )}
                        </ol>
                    }
                </div>
            }
            <p>{data.blurb}</p>
        </div>
    );
}
