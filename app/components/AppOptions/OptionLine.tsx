import styles from './OptionLine.module.css';
import type { appOptionDataIF } from './AppOptions';
import { FaCheck } from 'react-icons/fa';

interface propsIF {
    option: appOptionDataIF;
    isChecked: boolean;
    toggle: () => void;
}

export default function OptionLine(props: propsIF) {
    const { option, isChecked, toggle } = props;

    return (
        <li className={styles.option_line} onClick={toggle}>
            <div
                className={styles.checkbox}
                style={{ borderColor: `var(${isChecked ? '--accent1' : '--text3'})` }}
            >
                {isChecked && <FaCheck size={10} color={'var(--accent1)'} />}
            </div>
            {option.text}
        </li>
    );
}