import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './symbolsearch.module.css';
import { FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router';


interface SymbolInfoFieldProps {
  label: string;
  value: string;
  lastWsChange?: number;
  type?: 'positive' | 'negative';
}



const SymbolSearch: React.FC<SymbolInfoFieldProps> = ({ label, value, lastWsChange, type }) => {

    const navigate = useNavigate();

    const {symbol, coins, setSymbol} = useTradeDataStore();
    const [isOpen, setIsOpen] = useState(false);

    const wrapperClickHandler = () => {
        setIsOpen(!isOpen);
    }

    const symbolSelectListener = (coin: string) => {
        setSymbol(coin);
        navigate(`/trade/${coin}`);
        setIsOpen(false);
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
        <div className={styles.symbolListWrapper}>

            <div className={styles.symbolList}> 

                {
                    coins.map((c) => (
                        <div className={styles.symbolListItem} onClick={() => symbolSelectListener(c.coin)}>
                            {c.coin}
                        </div>
                    ))
                }
            </div>


        </div>
    )
}
</div>

</>
  );
}

export default SymbolSearch;
