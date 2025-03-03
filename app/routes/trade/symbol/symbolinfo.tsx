import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './symbolinfo.module.css';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';
import { useWsObserver } from '~/hooks/useWsObserver';
import { useEffect } from 'react';

interface SymbolInfoProps {
}


const symbolList = [
  'BTC',
  'ETH',
  'SOL',
  'XRP',
  'ADA',
  'DOGE',
]



const SymbolInfo: React.FC<SymbolInfoProps> = ({ }) => {


  const {subscribe, unsubscribeAllByChannel} = useWsObserver();

  const {symbol, setSymbol} = useTradeDataStore();

  
  useEffect(() => {
    return () => {
      unsubscribeAllByChannel('activeAssetCtx');
    }
  }, [])

  useEffect(() => {
    subscribe('activeAssetCtx', {
      payload: {coin: symbol},
      handler: (payload) => {
        console.log('>>>', payload)
      },
      single: true
    })
  }, [symbol])
  
  


  return (
    <div className={styles.symbolInfoContainer}>
      <ComboBox
        value={symbol}
        options={symbolList}
        onChange={(value) => setSymbol(value)}
      />

    </div>
  );
}

export default SymbolInfo;
