import styles from './HistoryTwapTable.module.css';

export interface TwapData {
  time: string;
  coin: string;
  totalSize: string;
  executedSize: string | null;
  averagePrice: string | null;
  totalRuntime: string;
  reduceOnly: string;
  randomize: string;
  status: 'Activated' | 'Terminated' | 'Finished';
}

interface HistoryTwapTableRowProps {
  twap: TwapData;
}

export default function HistoryTwapTableRow(props: HistoryTwapTableRowProps) {
  const { twap } = props;


  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Activated':
        return styles.statusActivated;
      case 'Terminated':
        return styles.statusTerminated;
      case 'Finished':
        return styles.statusFinished;
      default:
        return '';
    }
  };

  return (
    <div className={styles.rowContainer}>
      <div className={`${styles.cell} ${styles.timeCell}`}>{twap.time}</div>
      <div className={`${styles.cell} ${styles.coinCell}`}>{twap.coin}</div>
      <div className={`${styles.cell} ${styles.totalSizeCell}`}>{twap.totalSize}</div>
      <div className={`${styles.cell} ${styles.executedSizeCell}`}>
        {twap.executedSize || <span className={styles.emptyValue}>--</span>}
      </div>
      <div className={`${styles.cell} ${styles.averagePriceCell}`}>
        {twap.averagePrice || <span className={styles.emptyValue}>--</span>}
      </div>
      <div className={`${styles.cell} ${styles.totalRuntimeCell}`}>{twap.totalRuntime}</div>
      <div className={`${styles.cell} ${styles.reduceOnlyCell}`}>{twap.reduceOnly}</div>
      <div className={`${styles.cell} ${styles.randomizeCell}`}>{twap.randomize}</div>
      <div className={`${styles.cell} ${styles.statusCell} ${getStatusClass(twap.status)}`}>
        {twap.status}
      </div>
    </div>
  );
}