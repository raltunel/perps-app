import styles from './OptionLIne.module.css';
import type { appOptionDataIF } from './AppOptions';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { useState } from 'react';

interface propsIF {
    option: appOptionDataIF;
    toggle: (item: string) => void;
}

export default function OptionLine(props: propsIF) {
    const { option, toggle } = props;

    const [isOn, setIsOn] = useState<boolean>(option.isDefault);

    function handleClick(): void {
        setIsOn(!isOn);
        toggle(option.slug);
    }

    return (
        <li className={styles.option_line} onClick={() => handleClick()}>
            { isOn ? <MdOutlineCheckBox /> : <MdOutlineCheckBoxOutlineBlank /> }
            {option.text}
        </li>
    );
}