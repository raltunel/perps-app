import styles from './OptionLine.module.css';
import { FaCheck } from 'react-icons/fa';

interface propsIF {
    text: string;
    isChecked: boolean;
    toggle: () => void;
}

export default function OptionLine(props: propsIF) {
    const { text, isChecked, toggle } = props;

    return (
        <li className={styles.option_line} onClick={toggle}>
            <div
                className={styles.checkbox}
                style={{ borderColor: `var(${isChecked ? '--accent1' : '--text3'})` }}
            >
                {isChecked && <FaCheck size={10} color={'var(--accent1)'} />}
            </div>
            {text}
        </li>
    );
}