



import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './symbollist.module.css';
import { FaChevronDown } from 'react-icons/fa';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';import { FiSearch } from "react-icons/fi";
import SymbolListTableHeader from './SymbolListTableHeader';
import SymbolListTableRow from './SymbolListTableRow';


interface SymbolListProps {
  setIsOpen: (isOpen: boolean) => void;
}



const SymbolList: React.FC<SymbolListProps> = ({ setIsOpen }) => {

    
    const navigate = useNavigate();
    

    const {coins, setSymbol} = useTradeDataStore();

    const [searchQuery, setSearchQuery] = useState('');

    const symbolSelectListener = (coin: string) => {
        setSymbol(coin);
        navigate(`/trade/${coin}`);
        setIsOpen(false);
    }

    const coinsToShow = useMemo(() => {
        if(searchQuery.length === 0) return coins.slice(0, 50);
        return coins.filter((c) => c.coin.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, coins]);



  return (
<>
<div className={styles.symbolListWrapper}>


<div className={styles.symbolListSearch}>
<FiSearch className={styles.symbolListSearchIcon} />
<input autoFocus type="text" placeholder='Search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
</div>


                <SymbolListTableHeader />
            <div className={styles.symbolList}> 
                {
                    coinsToShow.map((c) => (
                        <SymbolListTableRow key={c.coin} symbol={c} symbolSelectListener={symbolSelectListener} />
                    ))
                }
            </div>


        </div>

</>
  );
}

export default SymbolList;
