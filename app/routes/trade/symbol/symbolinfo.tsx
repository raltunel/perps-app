'use client';

import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './symbolinfo.module.css';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';
import { useWsObserver, WsChannels } from '~/hooks/useWsObserver';
import { useEffect } from 'react';
import { processSymbolInfo } from '~/processors/processSymbolInfo';
import SymbolInfoField from './symbolinfofield/symbolinfofield';
import { getTimeUntilNextHour } from '~/utils/orderbook/OrderBookUtils';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useNavigate } from 'react-router';
import { HorizontalScrollable } from '~/components/Wrappers/HorizontanScrollable/HorizontalScrollable';
import { useAppSettings } from '~/stores/AppSettingsStore';
import SymbolSearch from './symbolsearch/symbolsearch';

interface SymbolInfoProps {
}


const symbolList = [
  'BTC',
  'ETH',
  'SOL',
  'XRP',
  'ADA',
  'DOGE',
  'MELANIA',
  'HYPE',
  'HMSTR',
  'FET',
  'kPEPE'
]



const SymbolInfo: React.FC<SymbolInfoProps> = ({ }) => {


  const { subscribe, unsubscribeAllByChannel } = useWsObserver();

  const { symbol, setSymbol, setSymbolInfo, symbolInfo } = useTradeDataStore();

  const navigate = useNavigate();

  const { formatNum, getDefaultPrecision } = useNumFormatter();

  const { orderBookMode } = useAppSettings();



  // useEffect(() => {
  //   subscribe(WsChannels.ACTIVE_COIN_DATA, {
  //     payload: {coin: symbol},
  //     handler: (payload) => {51
  //       if(payload.coin === symbol){
  //         setSymbolInfo(processSymbolInfo(payload));
  //       }
  //     },
  //     single: true
  //   })
  // }, [symbol])


  const get24hChangeString = () => {
    if (symbolInfo) {
      const usdChange = symbolInfo.markPx - symbolInfo.prevDayPx;
      const percentChange = (usdChange / symbolInfo.prevDayPx) * 100;
      const precision = getDefaultPrecision(symbolInfo.markPx);
      return {str:  `${usdChange > 0 ? '+' : ''}${formatNum(usdChange, precision + 1)}/${formatNum(percentChange, 2)}%`, usdChange};
    }
    return {str: '+0.0/%0.0', usdChange: 0};
  }




  return (
    <div className={styles.symbolInfoContainer}>
      <div className={styles.symbolSelector}>
        <SymbolSearch />
      </div>
      <div>
        {
          symbolInfo && symbolInfo.coin === symbol && (
            <HorizontalScrollable className={orderBookMode === 'large' ? styles.symbolInfoLimitorNarrow : styles.symbolInfoLimitor}>
              <div className={`${styles.symbolInfoFieldsWrapper} ${orderBookMode === 'large' ? styles.symbolInfoFieldsWrapperNarrow : ''}`}>
                <SymbolInfoField label="Mark" valueClass={'w4'} value={'$' + formatNum(symbolInfo?.markPx)} lastWsChange={symbolInfo?.lastPriceChange} />
                <SymbolInfoField label="Oracle" valueClass={'w4'} value={'$' + formatNum(symbolInfo?.oraclePx)} />
                <SymbolInfoField label="24h Change" valueClass={'w7'} value={get24hChangeString().str} type={get24hChangeString().usdChange > 0 ? 'positive' : get24hChangeString().usdChange < 0 ? 'negative' : undefined} />
                <SymbolInfoField label="24h Volume" valueClass={'w7'} value={'$'+formatNum(symbolInfo?.dayNtlVlm, 0)} />
                <SymbolInfoField label="Open Interest" valueClass={'w7'} value={'$'+formatNum(symbolInfo?.openInterest * symbolInfo?.oraclePx, 0)} />
                <SymbolInfoField label="Funding Rate" valueClass={'w7'} value={(symbolInfo?.funding * 100).toString().substring(0, 7) + '%'} type={'positive'} />
                <SymbolInfoField label="Funding Countdown" valueClass={'w7'} value={getTimeUntilNextHour()} />
              </div>
            </HorizontalScrollable>
          )
        }
      </div>

    </div>
  );
}

export default SymbolInfo;
