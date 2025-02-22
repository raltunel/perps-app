import { useEffect, useState } from 'react';
import { useWebSocketContext } from '~/contexts/WebSocketContext';
import OrderRow from './orderrow/orderrow';
import styles from './orderbook.module.css';
import { useWsObserver } from '~/hooks/useWsObserver';
import { processOrderBookMessage } from '~/processors/processOrderBook';
import { useOrderBookStore } from '~/stores/OrderBookStore';

interface OrderBookProps {
  symbol: string;
}


export interface OrderRowIF{
  px: number;
  sz: number;
  n: number;
  type: 'buy' | 'sell';
  total: number;
  ratio: number;
}


const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {


    const { subscribe} = useWsObserver();
    const {readyState} = useWebSocketContext();

    const {buys, sells, setOrderBook} = useOrderBookStore();

    useEffect(() => {
      subscribe('l2Book', 
        {payload: {coin: symbol},
        handler: (payload) => {
          const {sells, buys} = processOrderBookMessage(payload);
          setOrderBook(buys, sells);
        }
      })
    }, [symbol])

  return (
    <div className={styles.orderBookContainer}>

<div className={styles.orderBookHeader}>

<div>Price</div>
<div>Size</div>
<div>Total</div>

</div>

<div className={styles.orderBookBlock}>
      {sells.slice(0, 10).reverse().map((order, index) => (
        <OrderRow key={order.px} order={order} />
      ))}
</div>


<div className={styles.orderBookBlockMid}>

      <div>Spread</div>
      <div>0.1</div>
      <div>0.01%</div>

</div>

<div className={styles.orderBookBlock}>
      {buys.slice(0, 10).map((order) => (
        <OrderRow key={order.px} order={order} />
      ))}
</div>

     
    </div>
  );
}

export default OrderBook;
