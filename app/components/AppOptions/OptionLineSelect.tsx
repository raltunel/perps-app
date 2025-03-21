import { useState } from 'react';
import styles from './OptionLineSelect.module.css';

interface propsIF {
    text: string;
}

export default function OptionLineSelect(props: propsIF) {
    const { text } = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <li className={styles.option_line}>
            {text}
            {
                isOpen
                    ? <div onClick={() => setIsOpen(false)}>Click to Close</div>
                    : <div onClick={() => setIsOpen(true)}>Click to Open</div>
            }
        </li>
    );
}