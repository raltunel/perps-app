import styles from './OptionLIne.module.css';
import type { appOptionDataIF } from './AppOptions';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { useState } from 'react';

interface propsIF {
    option: appOptionDataIF;
}

export default function OptionLine(props: propsIF) {
    const { option } = props;

    const [isOn, setIsOn] = useState<boolean>(option.isDefault);

    return (
        <li className={styles.option_line} onClick={() => setIsOn(!isOn)}>
            { isOn ? <MdOutlineCheckBox /> : <MdOutlineCheckBoxOutlineBlank /> }
            {option.text}
        </li>
    );
}