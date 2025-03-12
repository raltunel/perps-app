import React from 'react';
import styles from './OpenOrdersTable.module.css';

export interface OpenOrderData {
  time: string;
  type: string;
  coin: string;
  direction: 'Long' | 'Short';
  size: string;
  originalSize: string;
  orderValue: string;
  price: string;
  reduceOnly: string;
  triggerConditions: string;
  tpsl: string;
}

interface OpenOrdersTableRowProps {
  order: OpenOrderData;
  onCancel?: (time: string, coin: string) => void;
}

export default function OpenOrdersTableRow(props: OpenOrdersTableRowProps) {
  const { order, onCancel } = props;

  const handleCancel = () => {
    if (onCancel) {
      onCancel(order.time, order.coin);
    }
  };

  return (
    <div className={styles.rowContainer}>
      <div className={`${styles.cell} ${styles.timeCell}`}>{order.time}</div>
      <div className={`${styles.cell} ${styles.typeCell}`}>{order.type}</div>
      <div className={`${styles.cell} ${styles.coinCell}`}>{order.coin}</div>
      <div className={`${styles.cell} ${styles.directionCell} ${order.direction === 'Long' ? styles.longDirection : styles.shortDirection}`}>
        {order.direction}
      </div>
      <div className={`${styles.cell} ${styles.sizeCell}`}>{order.size}</div>
      <div className={`${styles.cell} ${styles.originalSizeCell}`}>{order.originalSize}</div>
      <div className={`${styles.cell} ${styles.orderValueCell}`}>{order.orderValue}</div>
      <div className={`${styles.cell} ${styles.priceCell}`}>{order.price}</div>
      <div className={`${styles.cell} ${styles.reduceOnlyCell}`}>{order.reduceOnly}</div>
      <div className={`${styles.cell} ${styles.triggerConditionsCell}`}>{order.triggerConditions}</div>
      <div className={`${styles.cell} ${styles.tpslCell}`}>{order.tpsl}</div>
      <div className={`${styles.cell} ${styles.cancelCell}`}>
        <button className={styles.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}