import { useMemo } from 'react';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { useTradeModuleStore } from '~/stores/TradeModuleStore';
import type { OrderBookRowIF, OrderRowResolutionIF } from '~/utils/orderbook/OrderBookIFs';
import styles from './orderrow.module.css';

interface OrderRowProps {
  order: OrderBookRowIF;
  coef: number;
  resolution: OrderRowResolutionIF | null;
  userSlots: Set<string>;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, coef, resolution, userSlots }) => {

  const { formatNum } = useNumFormatter();

  const { getBsColor } = useAppSettings();

  const { setTradeSlot } = useTradeModuleStore();


  const formattedPrice = useMemo(() => {
    return formatNum(order.px, resolution);
  }, [order.px, resolution]);

  const handleClick = () => {
    setTradeSlot({
      coin: order.coin,
      amount: order.sz,
      price: order.px,
      type: order.type,
    });
  }
  return (
    <div className={`${styles.orderRow} ${userSlots.has(formattedPrice) ? styles.userOrder : ''}`} onClick={handleClick} >
      {userSlots.has(formattedPrice) && <div className={styles.userOrderIndicator}></div>}
      <div className={styles.orderRowPrice} style={{color: order.type === 'buy' ? getBsColor().buy : getBsColor().sell}}>{formattedPrice}</div>
      <div className={styles.orderRowSize}>{formatNum(order.sz * coef)}</div>
      <div className={styles.orderRowTotal}>{formatNum(order.total * coef)}</div>
      <div className={styles.ratio} style={{ width: `${order.ratio * 100}%`, backgroundColor: order.type === 'buy' ? getBsColor().buy : getBsColor().sell }} ></div>
      {/* <div className={styles.fadeOverlay}></div> */}
    </div>
  );
}

export default OrderRow;
