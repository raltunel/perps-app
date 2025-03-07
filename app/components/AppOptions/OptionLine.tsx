import styles from './OptionLIne.module.css';
import type { appOptionDataIF } from './AppOptions';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';

interface propsIF {
    option: appOptionDataIF;
    isChecked: boolean;
    toggle: (item: string) => void;
}

export default function OptionLine(props: propsIF) {
    const { option, isChecked, toggle } = props;

    return (
        <li className={styles.option_line} onClick={() => toggle(option.slug)}>
            { isChecked ? <MdOutlineCheckBox /> : <MdOutlineCheckBoxOutlineBlank /> }
            {option.text}
        </li>
    );
}