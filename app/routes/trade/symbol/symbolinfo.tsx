import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './symbolinfo.module.css';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';
import { useWsObserver } from '~/hooks/useWsObserver';
import { useEffect } from 'react';
import { processSymbolInfo } from '~/processors/processSymbolInfo';
import SymbolInfoField from './symbolinfofield/symbolinfofield';
import { formatNum } from '~/utils/orderbook/OrderBookUtils';

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

  const {symbol, setSymbol, setSymbolInfo, symbolInfo} = useTradeDataStore();

  
  useEffect(() => {
    return () => {
      unsubscribeAllByChannel('activeAssetCtx');
    }
  }, [])

  useEffect(() => {
    subscribe('activeAssetCtx', {
      payload: {coin: symbol},
      handler: (payload) => {
        if(payload.coin === symbol){
          setSymbolInfo(processSymbolInfo(payload));
        }
      },
      single: true
    })
  }, [symbol])


  


  return (
    <div className={styles.symbolInfoContainer}>
      <div className={styles.symbolSelector}> 
        <ComboBox
          value={symbol}
          options={symbolList}
          onChange={(value) => setSymbol(value)}
      />
      </div>
      {
        symbolInfo && (
          <div className={styles.symbolInfoFieldsWrapper}>
            <SymbolInfoField label="Mark" value={formatNum(symbolInfo?.markPx)} lastPriceChange={symbolInfo?.lastPriceChange} />
            <SymbolInfoField label="Oracle" value={formatNum(symbolInfo?.oraclePx)} />
            {/* <SymbolInfoField label="24h Change" value={symbolInfo?..toString()} /> */}
            <SymbolInfoField label="24h Change" value={'+10.3 / %+1.2'} />
            <SymbolInfoField label="24h Volume" value={formatNum(symbolInfo?.dayNtlVlm)} />
            <SymbolInfoField label="Open Interest" value={formatNum(symbolInfo?.openInterest * symbolInfo?.oraclePx)} />
            <SymbolInfoField label="Funding Rate" value={formatNum(symbolInfo?.funding)} />
            <SymbolInfoField label="Funding Countdown" value={symbolInfo?.funding.toString()} />

          </div>
        )
      }

    </div>
  );
}

export default SymbolInfo;
