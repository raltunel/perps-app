import { useEffect, useRef, useState } from 'react';
import styles from './TransferDropdown.module.css';
import { LuChevronDown } from 'react-icons/lu';

interface propsIF {
    idForDOM: string;
    labelText: string;
    initial: string;
    options: string[];
    handleChange: (option: string) => void;
}

export default function TransferDropdown(props: propsIF) {
    const { idForDOM, labelText, initial, options, handleChange } = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (dropdownRef.current && event.target instanceof Node) {
                if (!dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            }
        };
        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={styles.transfer_dropdown}>
            <label htmlFor={idForDOM}>{labelText}</label>
            <div className={styles.dropdown} ref={dropdownRef}>
                <button onClick={() => setIsOpen(!isOpen)}>
                    <output id={idForDOM}>{initial}</output>
                    <LuChevronDown size={16} color={'var(--text2)'} />
                </button>
                {isOpen && (
                    <ul>
                        {options.map((option: string) => (
                            <li
                                key={option}
                                onClick={() => {
                                    handleChange(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
