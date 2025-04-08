import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './symbolsearch.module.css';
import { FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import SymbolList from './symbollist/symbollist';


interface SymbolInfoFieldProps {
}



const SymbolSearch: React.FC<SymbolInfoFieldProps> = () => {

    const {symbol} = useTradeDataStore();
    const [isOpen, setIsOpen] = useState(false);

    const wrapperClickHandler = () => {
        setIsOpen(!isOpen);
    }


  return (
<>
<div className={styles.symbolSearchBackdrop}>

<div className={styles.symbolSearchContainer} onClick={wrapperClickHandler}>

    <div className={styles.symbolIcon}>
        <img src={`https://app.hyperliquid.xyz/coins/${symbol}.svg`} alt={symbol} />
    </div>

    <div className={styles.symbolName}>
        {symbol}-USD
    </div>

    
<FaChevronDown className={`${styles.comboBoxIcon} ${isOpen ? styles.comboBoxIconOpen : ''}`} />

</div>

{
    isOpen && (
        <SymbolList setIsOpen={setIsOpen} />
    )
}
</div>

</>
  );
}

export default SymbolSearch;
