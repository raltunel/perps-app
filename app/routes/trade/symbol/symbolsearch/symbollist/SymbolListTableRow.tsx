import useNumFormatter from '~/hooks/useNumFormatter';
import { useAppSettings } from '~/stores/AppSettingsStore';
import type { SymbolInfoIF } from '~/utils/SymbolInfoIFs';
import { TbHeart, TbHeartFilled } from 'react-icons/tb';
import styles from './symbollist.module.css';
import { useNavigate } from 'react-router';
import { useTradeDataStore } from '~/stores/TradeDataStore';


interface SymbolListTableRowProps {
  symbol: SymbolInfoIF;
  symbolSelectListener: (symbol: string) => void;
}

export default function SymbolListTableRow(props: SymbolListTableRowProps) {
  const { symbol, symbolSelectListener } = props;

  const {formatNum, getDefaultPrecision} = useNumFormatter();
  const {getBsColor} = useAppSettings();
  const navigate = useNavigate();

  const {favKeys, addToFavKeys, removeFromFavKeys} = useTradeDataStore();

  const get24hChangeString = () => {
    if (symbol) {
      const usdChange = symbol.markPx - symbol.prevDayPx;
      const percentChange = (usdChange / symbol.prevDayPx) * 100;
      const precision = getDefaultPrecision(symbol.markPx);
      return {str:  `${usdChange > 0 ? '+' : ''}${formatNum(usdChange, precision + 1)} / ${formatNum(percentChange, 2)}%`, usdChange};
    }
    return {str: '+0.0 / %0.0', usdChange: 0};
  }

  const handleClick = () => {
    symbolSelectListener(symbol.coin);
  }

  const handleFavClick = (event: React.MouseEvent<SVGSVGElement>) => {

    event.stopPropagation();

    if(favKeys.includes(symbol.coin)){
      removeFromFavKeys(symbol.coin);
    }else{
      addToFavKeys(symbol.coin);
    }
    console.log('>>> handleFavClick', symbol.coin);
  }

  return (
    <div className={styles.rowContainer}  onClick={handleClick}>
      <div className={`${styles.cell} ${styles.symbolCell}`}>
        {
          favKeys.includes(symbol.coin) ? (
            <TbHeartFilled className={styles.favIcon} color='var(--red)' onClick={handleFavClick} />
          ) : (
            <TbHeart style={{color: 'var(--text2)'}} className={styles.favIcon} onClick={handleFavClick} />
          )
        }
        <div className={styles.symbolName}>{symbol.coin} - USD</div>
        <div className={styles.leverageLabel}>{symbol.maxLeverage}x</div>
        </div>
      <div className={`${styles.cell} ${styles.lastPriceCell}`}>{formatNum(symbol.markPx)}</div>
      <div className={`${styles.cell} ${styles.changeCell}`} style={{color: get24hChangeString().usdChange > 0 ? getBsColor().buy : (get24hChangeString().usdChange < 0 ? getBsColor().sell : 'var(--text2)')}}>{get24hChangeString().str}</div>
      <div className={`${styles.cell} ${styles.fundingCell}`}>{formatNum(symbol.funding * 100)}</div>
      <div className={`${styles.cell} ${styles.volumeCell}`}>{formatNum(symbol.dayNtlVlm)}</div>
      <div className={`${styles.cell} ${styles.openInterestCell}`}>{formatNum(symbol.openInterest * symbol.oraclePx)}</div>
    </div>
  );
}