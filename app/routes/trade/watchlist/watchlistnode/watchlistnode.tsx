
import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './watchlistnode.module.css';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';
import { useWsObserver } from '~/hooks/useWsObserver';
import { useEffect, useMemo, useState } from 'react';
import { processSymbolInfo } from '~/processors/processSymbolInfo';
import { formatNum, getTimeUntilNextHour } from '~/utils/orderbook/OrderBookUtils';
import { TbHeartFilled } from 'react-icons/tb';
import { FiDollarSign, FiPercent } from 'react-icons/fi';
import type { SymbolInfoIF } from '~/utils/SymbolInfoIFs';

interface WatchListNodeProps {
    symbol: SymbolInfoIF;
    showMode: 'dollar' | 'percent'
}


const WatchListNode: React.FC<WatchListNodeProps> = ({symbol, showMode }) => {



    const {symbol: storeSymbol, setSymbol: setStoreSymbol} = useTradeDataStore();

    const change = useMemo(() => {
        return symbol.markPx - symbol.prevDayPx;
    }, [symbol]);


    const nodeClickListener = () => {
        if(symbol.coin === storeSymbol) return;
        setStoreSymbol(symbol.coin);
    }

    const shownVal = useMemo( () => {

        if(showMode === 'dollar'){
            return formatNum(symbol.markPx);
        }else{
            return formatNum((symbol.markPx - symbol.prevDayPx) / symbol.prevDayPx * 100, 2) + '%'
        }


    }, [showMode])


  return (
    <div className={styles.watchListNodeContainer} onClick={nodeClickListener}>
      <div className={styles.symbolName}>{symbol.coin}-USD</div>
      <div className={`${styles.symbolValue} ${change > 0 ? styles.positive : change < 0 ? styles.negative : ''}` }>{shownVal}</div>
    </div>
  );
}

export default WatchListNode;
