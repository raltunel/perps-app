import { useState } from 'react';
import styles from './OptionLineSelect.module.css';
import { SlArrowDown } from 'react-icons/sl';


interface dropdownOptionsIF {
    readable: string;
    set: () => void;
}

interface propsIF {
    text: string;
    active: string;
    options: dropdownOptionsIF[];
}

export default function OptionLineSelect(props: propsIF) {
    const { text, active, options } = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <li className={styles.option_line}>
            {text}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={styles.dropdown_container}
            >
                <div className={styles.active_option}>
                    {active}
                    <SlArrowDown />
                </div>
                {isOpen && (
                    <div className={styles.options_dropdown}>
                        {
                            options.map((o: dropdownOptionsIF) => (
                                <div onClick={() => o.set()}>
                                    {o.readable}
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </li>
    );
}