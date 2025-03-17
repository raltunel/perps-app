import styles from './PositionsTable.module.css';

export interface PositionData {
  coin: string;
  leverageBadge: string;
  size: string;
  positionValue: string;
  entryPrice: string;
  markPrice: string;
  pnl: {
    value: string;
    percentage: string;
    isPositive: boolean;
  };
  liqPrice: string;
  margin: string;
  funding: string;
  tpsl: string;
}

interface PositionsTableRowProps {
  position: PositionData;
}

export default function PositionsTableRow(props: PositionsTableRowProps) {
  const { position } = props;

  return (
    <div className={styles.rowContainer}>
      <div className={`${styles.cell} ${styles.coinCell}`}>
        {position.coin}
        {position.leverageBadge && (
          <span className={styles.badge}>{position.leverageBadge}</span>
        )}
      </div>
      <div className={`${styles.cell} ${styles.sizeCell}`}>{position.size}</div>
      <div className={`${styles.cell} ${styles.positionValueCell}`}>{position.positionValue}</div>
      <div className={`${styles.cell} ${styles.entryPriceCell}`}>{position.entryPrice}</div>
      <div className={`${styles.cell} ${styles.markPriceCell}`}>{position.markPrice}</div>
      <div className={`${styles.cell} ${styles.pnlCell} ${position.pnl.isPositive ? styles.pnlPositive : ''}`}>
        {position.pnl.value} ({position.pnl.percentage})
      </div>
      <div className={`${styles.cell} ${styles.liqPriceCell}`}>{position.liqPrice}</div>
      <div className={`${styles.cell} ${styles.marginCell}`}>{position.margin}</div>
      <div className={`${styles.cell} ${styles.fundingCell}`}>{position.funding}</div>
      <div className={`${styles.cell} ${styles.tpslCell}`}>{position.tpsl}</div>
      <div className={`${styles.cell} ${styles.closeCell}`}>
        <div className={styles.actionContainer}>
          <button className={styles.actionButton}>Limit</button>
          <button className={styles.actionButton}>Market</button>
        </div>
      </div>
    </div>
  );
}