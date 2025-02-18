import { useEffect, useState } from 'react';
import { useWebSocketContext } from '~/contexts/WebSocketContext';
import type { OrderRowIF } from '../orderbook';
import styles from './orderrow.module.css';

interface OrderRowProps {
  order: OrderRowIF;
}

const OrderRow: React.FC<OrderRowProps> = ({ order }) => {

  return (
    <div className={`${styles.orderRow} ${order.type === 'buy' ? styles.buy : styles.sell}`} >
      <div className={styles.orderRowPrice}>{order.px}</div>
      <div className={styles.orderRowSize}>{order.sz}</div>
      <div className={styles.orderRowTotal}>{order.total}</div>
      <div className={styles.ratio} style={{ width: `${order.ratio * 100}%` }}></div>
      <div className={styles.fadeOverlay}></div>
    </div>
  );
}

export default OrderRow;
