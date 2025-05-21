import { useEffect, useRef, useState, type JSX } from 'react';
import { SlArrowDown } from 'react-icons/sl';
import styles from './OptionLineSelect.module.css';

interface dropdownOptionsIF {
    readable: string | JSX.Element;
    set: () => void;
}

interface propsIF {
    text: string;
    active: string | JSX.Element;
    options: dropdownOptionsIF[];
}

export default function OptionLineSelect(props: propsIF) {
    const { text, active, options } = props;

    // boolean to track whether the options dropdown is open
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // clicks outside the elem with the ref will close the dropdown
    const dropdownRef = useRef<HTMLDivElement>(null);
    // logic to close the dropdown
    // using `isOpen` in gatekeeping and dependencies seem to speed it up
    useEffect(() => {
        // use mousedown event to trigger action in DOM
        const TRIGGER = 'mousedown';
        // fn to run in response to mousedown
        const handleClickOutside = (event: MouseEvent): void => {
            // determine if this elem or children were clicked
            // gatekeeping with `isOpen` seems to save computation time
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                isOpen
            ) {
                setIsOpen(false);
            }
        };
        // add event listener to DOM when component mounts
        // wait for menu to be opened before adding event listener, seems
        // ... to help things move faster
        if (isOpen) document.addEventListener(TRIGGER, handleClickOutside);
        // remove event listener from DOM when component dismounts
        return () => document.removeEventListener(TRIGGER, handleClickOutside);
    }, [isOpen]);

    return (
        <li className={styles.option_line}>
            {text}

            <div
                ref={dropdownRef}
                onClick={() => setIsOpen(!isOpen)}
                className={styles.dropdown_container}
            >
                <div className={styles.active_option}>
                    {active}
                    <SlArrowDown />
                </div>
                {isOpen && (
                    <div className={styles.options_dropdown}>
                        {options.map((o: dropdownOptionsIF) => (
                            <div onClick={() => o.set()}>{o.readable}</div>
                        ))}
                    </div>
                )}
            </div>
        </li>
    );
}
