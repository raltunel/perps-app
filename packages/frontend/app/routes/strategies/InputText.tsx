import { useState, type ChangeEvent } from 'react';
import styles from './InputText.module.css';
import { LuChevronDown } from 'react-icons/lu';
import type { textInputIF } from './CreateStrategy';

interface propsIF {
    initial: string;
    data: textInputIF;
    handleChange: (text: string) => void;
}

export default function InputText(props: propsIF) {
    const {
        initial,
        data,
        handleChange,
    } = props;
    console.log(initial);

    const idForDOM: string = 'CREATE_STRATEGY_'
        + data.label.toUpperCase().replace(' ', '_');

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selection, setSelection] = useState<string>(initial);

    return (
        <div className={styles.text_input}>
            <label htmlFor={idForDOM}>{data.label}</label>
            { typeof data.input === 'string' &&
                <input
                    type='text'
                    id={idForDOM}
                    defaultValue={selection}
                    placeholder={data.input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e.currentTarget.value)
                    }
                    autoComplete='off'
                />
            }
            { Array.isArray(data.input) &&
                <div className={styles.dropdown}>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <output
                            id={idForDOM}
                            onChange={() => console.log('wowee')}
                        >
                            {selection}
                        </output>
                        <LuChevronDown />
                    </button>
                    { isOpen &&
                        <ul>
                            { data.input.map((inp: string) => (
                                <li
                                    key={inp}
                                    onClick={() => {
                                        handleChange(inp);
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
