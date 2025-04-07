



import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './symbollist.module.css';
import { FaChevronDown } from 'react-icons/fa';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';import { FiSearch } from "react-icons/fi";



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

    const changeListener = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    const coinsToShow = useMemo(() => {
        if(searchQuery.length === 0) return coins;
        return coins.filter((c) => c.coin.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);




  return (
<>
<div className={styles.symbolListWrapper}>


<div className={styles.symbolListSearch}>
<FiSearch className={styles.symbolListSearchIcon} />
<input type="text" placeholder='Search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
</div>

            <div className={styles.symbolList}> 

                {
                    coinsToShow.map((c) => (
                        <div className={styles.symbolListItem} onClick={() => symbolSelectListener(c.coin)}>
                            {c.coin}
                        </div>
                    ))
                }
            </div>


        </div>

</>
  );
}

export default SymbolList;
