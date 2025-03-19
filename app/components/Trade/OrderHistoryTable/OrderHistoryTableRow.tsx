import styles from './OrderHistoryTable.module.css';

export interface OrderHistoryData {
  time: string;
  type: string;
  coin: string;
  direction: 'Long' | 'Short';
  size: string;
  filledSize: string;
  orderValue: string;
  price: string;
  reduceOnly: string;
  triggerConditions: string;
  tpsl: string;
  status: string;
  orderId: string;
}

interface OrderHistoryTableRowProps {
  order: OrderHistoryData;
}

export default function OrderHistoryTableRow(props: OrderHistoryTableRowProps) {
  const { order } = props;

  return (
    <div className={styles.rowContainer}>
      <div className={`${styles.cell} ${styles.timeCell}`}>{order.time}</div>
      <div className={`${styles.cell} ${styles.typeCell}`}>{order.type}</div>
      <div className={`${styles.cell} ${styles.coinCell}`}>{order.coin}</div>
      <div className={`${styles.cell} ${styles.directionCell} ${order.direction === 'Long' ? styles.longDirection : styles.shortDirection}`}>
        {order.direction}
      </div>
      <div className={`${styles.cell} ${styles.sizeCell}`}>{order.size}</div>
      <div className={`${styles.cell} ${styles.filledSizeCell}`}>{order.filledSize}</div>
      <div className={`${styles.cell} ${styles.orderValueCell}`}>{order.orderValue}</div>
      <div className={`${styles.cell} ${styles.priceCell}`}>{order.price}</div>
      <div className={`${styles.cell} ${styles.reduceOnlyCell}`}>{order.reduceOnly}</div>
      <div className={`${styles.cell} ${styles.triggerConditionsCell}`}>{order.triggerConditions}</div>
      <div className={`${styles.cell} ${styles.tpslCell}`}>{order.tpsl}</div>
      <div className={`${styles.cell} ${styles.statusCell}`}>{order.status}</div>
      <div className={`${styles.cell} ${styles.orderIdCell}`}>{order.orderId}</div>
    </div>
  );
}