import { useEffect, useState } from 'react';
import { useWebSocketContext } from '~/contexts/WebSocketContext';
import type { OrderRowIF } from '~/utils/orderbook/OrderBookIFs';
import styles from './orderrow.module.css';
import { formatNum } from '~/utils/orderbook/OrderBookUtils';

interface OrderRowProps {
  order: OrderRowIF;
  coef: number;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, coef }) => {

  // const [showFade, setShowFade] = useState(false);

  // useEffect(() => {
  //   setShowFade(true);
  //   setTimeout(() => {
  //     setShowFade(false);
  //   }, 1000);
  // }, [order.px]);

  return (
    <div className={`${styles.orderRow} ${order.type === 'buy' ? styles.buy : styles.sell}`} >
      <div className={styles.orderRowPrice}>{formatNum(order.px)}</div>
      <div className={styles.orderRowSize}>{formatNum(order.sz * coef)}</div>
      <div className={styles.orderRowTotal}>{formatNum(order.total * coef)}</div>
      <div className={styles.ratio} style={{ width: `${order.ratio * 100}%` }}></div>
      {/* {showFade && <div className={styles.fadeOverlay}></div>} */}
      <div className={styles.fadeOverlay}></div>
    </div>
  );
}

export default OrderRow;
