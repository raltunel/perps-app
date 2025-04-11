import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './symbolsearch.module.css';
import { FaChevronDown } from 'react-icons/fa';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import SymbolList from './symbollist/symbollist';
import useOutsideClick from '~/hooks/useOutsideClick';

interface SymbolInfoFieldProps {}

const SymbolSearch: React.FC<SymbolInfoFieldProps> = () => {
    const { symbol } = useTradeDataStore();
    const [isOpen, setIsOpen] = useState(false);

    const symbolSearchBackdropRef = useOutsideClick<HTMLDivElement>(() => {
        setIsOpen(false);
    }, true);

    const wrapperClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsOpen(!isOpen);
    };

    const symbolFileName = useMemo(() => {
        const match = symbol.match(/^k([A-Z]+)$/);
        return match ? match[1] : symbol;
    }, [symbol]);

    return (
        <>
            <div
                className={styles.symbolSearchBackdrop}
                ref={symbolSearchBackdropRef}
            >
                <div
                    className={styles.symbolSearchContainer}
                    onClick={wrapperClickHandler}
                >
                    <div className={styles.symbolIcon}>
                        <img
                            src={`https://app.hyperliquid.xyz/coins/${symbolFileName}.svg`}
                            alt={symbolFileName}
                        />
                    </div>

                    <div className={styles.symbolName}>{symbol}-USD</div>

                    <FaChevronDown
                        className={`${styles.comboBoxIcon} ${isOpen ? styles.comboBoxIconOpen : ''}`}
                    />
                </div>

                {isOpen && <SymbolList setIsOpen={setIsOpen} />}
            </div>
        </>
    );
};

export default SymbolSearch;
