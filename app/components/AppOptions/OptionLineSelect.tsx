import styles from './OptionLineSelect.module.css';

interface propsIF {
    text: string;
}

export default function OptionLineSelect(props: propsIF) {
    const { text } = props;

    return (
        <li className={styles.option_line}>
            {text}
        </li>
    );
}