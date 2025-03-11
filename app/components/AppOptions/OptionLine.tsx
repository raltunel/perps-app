import { useState } from 'react';
import styles from './OptionLIne.module.css';
import type { appOptionDataIF } from './AppOptions';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';

interface propsIF {
    option: appOptionDataIF;
    isEnabled: boolean;
    markForUpdate: () => void;
}

export default function OptionLine(props: propsIF) {
    const { option, isEnabled, markForUpdate } = props;

    const [isChecked, setIsChecked] = useState<boolean>(isEnabled);

    return (
        <li
            className={styles.option_line}
            onClick={() => {
                setIsChecked(!isChecked);
                markForUpdate();
            }}
        >
            { isChecked ? <MdOutlineCheckBox /> : <MdOutlineCheckBoxOutlineBlank /> }
            {option.text}
        </li>
    );
}