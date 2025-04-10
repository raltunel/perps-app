import { BiChevronDown } from 'react-icons/bi';
import styles from './VaultTimeframe.module.css';
import { FaChevronDown } from 'react-icons/fa';
import { LuChevronDown } from 'react-icons/lu';
import useOutsideClick from '~/hooks/useOutsideClick';

interface Props {
    timeframe: string;
    setTimeframe: (value: string) => void;
    open: boolean;
    setOpen: (value: boolean) => void;
}

const timeframes = ['1D', '7D', '30D', '90D', '1Y'];

export default function VaultTimeframe(props: Props) {
    const { timeframe, setTimeframe, open, setOpen } = props;

    const dropdownRef = useOutsideClick<HTMLDivElement>(() => {
        setOpen(false);
    }, open);

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button onClick={() => setOpen(!open)}>
                {timeframe} <LuChevronDown size={18} className={styles.icon} />
            </button>
            <div className={`${styles.menu} ${open ? styles.open : ''}`}>
                {timeframes.map((tf) => (
                    <div
                        key={tf}
                        className={styles.menuItem}
                        onClick={() => {
                            setTimeframe(tf);
                            setOpen(false);
                        }}
                    >
                        {tf}
                    </div>
                ))}
            </div>
        </div>
    );
}
