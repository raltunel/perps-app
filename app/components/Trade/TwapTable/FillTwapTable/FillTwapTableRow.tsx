import styles from './FillTwapTable.module.css';

export interface FillData {
  time: string;
  coin: string;
  direction: 'Open Long' | 'Open Short' | 'Close Long' | 'Close Short';
  price: string;
  size: string;
  tradeValue: string;
  fee: string;
  closedPnl: string;
}

interface FillTwapTableRowProps {
  fill: FillData;
}

export default function FillTwapTableRow(props: FillTwapTableRowProps) {
  const { fill } = props;

  // to determine direction class
  const getDirectionClass = (direction: string) => {
    if (direction.includes('Long')) {
      return styles.openLong;
    } else if (direction.includes('Short')) {
      return styles.openShort;
    }
    return '';
  };

  // to determine PNL class
  const getPnlClass = (pnl: string) => {
    if (pnl.startsWith('-')) {
      return styles.negative;
    } else if (pnl !== '$0.00') {
      return styles.positive;
    }
    return '';
  };

  return (
    <div className={styles.rowContainer}>
      <div className={`${styles.cell} ${styles.timeCell}`}>{fill.time}</div>
      <div className={`${styles.cell} ${styles.coinCell}`}>{fill.coin}</div>
      <div className={`${styles.cell} ${styles.directionCell} ${getDirectionClass(fill.direction)}`}>
        {fill.direction}
      </div>
      <div className={`${styles.cell} ${styles.priceCell}`}>{fill.price}</div>
      <div className={`${styles.cell} ${styles.sizeCell}`}>{fill.size}</div>
      <div className={`${styles.cell} ${styles.tradeValueCell}`}>{fill.tradeValue}</div>
      <div className={`${styles.cell} ${styles.feeCell}`}>{fill.fee}</div>
      <div className={`${styles.cell} ${styles.closedPnlCell} ${getPnlClass(fill.closedPnl)}`}>
        {fill.closedPnl}
      </div>
    </div>
  );
}