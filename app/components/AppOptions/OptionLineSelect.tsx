import { useState } from 'react';
import styles from './OptionLineSelect.module.css';

interface propsIF {
    text: string;
    active: string;
    options: string[];
}

export default function OptionLineSelect(props: propsIF) {
    const { text, active, options } = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <li className={styles.option_line}>
            {text}
            {
                isOpen
                    ? (
                        <div onClick={() => setIsOpen(false)}>
                            {
                                options.map((o: string) => (
                                    <div>{o}</div>
                                ))
                            }
                        </div>
                    ) : <div onClick={() => setIsOpen(true)}>{active}</div>
            }
        </li>
    );
}