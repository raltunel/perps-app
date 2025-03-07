import styles from './OptionLIne.module.css';
import type { appOptionDataIF } from './AppOptions';

interface propsIF {
    option: appOptionDataIF;
}

export default function OptionLine(props: propsIF) {
    const { option } = props;

    return (
        <li className={styles.option_line}>
            {option.text}
        </li>
    );
}