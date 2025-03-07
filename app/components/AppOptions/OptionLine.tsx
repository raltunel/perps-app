import styles from './OptionLIne.module.css';
import type { appOptionDataIF } from './AppOptions';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';

interface propsIF {
    option: appOptionDataIF;
}

export default function OptionLine(props: propsIF) {
    const { option } = props;

    return (
        <li className={styles.option_line}>
            <MdOutlineCheckBoxOutlineBlank />
            <MdOutlineCheckBox />
            {option.text}
        </li>
    );
}