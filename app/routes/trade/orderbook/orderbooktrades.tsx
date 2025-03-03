
import { useWsObserver } from '~/hooks/useWsObserver';
import styles from './orderbooktrades.module.css';
import { useEffect, useRef } from 'react';
import { useOrderBookStore } from '~/stores/OrderBookStore';
import type { OrderBookTradeIF } from '~/utils/orderbook/OrderBookIFs';
import { processOrderBookTrades } from '~/processors/processOrderBook';
import OrderTradeRow from './ordertraderow/ordertraderow';
import BasicDivider from '~/components/Dividers/BasicDivider';
import { useUIStore } from '~/stores/UIStore';

interface OrderBookTradesProps {
  symbol: string;
}

const OrderBookTrades: React.FC<OrderBookTradesProps> = ({ symbol }) => {

  const { subscribe, unsubscribeAllByChannel} = useWsObserver();
  const { trades, setTrades } = useOrderBookStore();

  const { orderBookMode } = useUIStore();
  
  const tradesRef = useRef<OrderBookTradeIF[]>([]);
  tradesRef.current = trades;

  const tradesCount = 25;


  useEffect(() => {
    return () => {
      unsubscribeAllByChannel('trades');
    }
  }, [])


  const mergeTrades = (wsTrades: OrderBookTradeIF[]) => {
    if(wsTrades && wsTrades.length > 0 && wsTrades[0].coin === symbol) {
      if(tradesRef.current.length > 0 && tradesRef.current[0].coin === symbol) {
        setTrades([...wsTrades, ...tradesRef.current].slice(0, tradesCount));
      } else {
        setTrades(wsTrades.slice(0, tradesCount));
      }
    }
  }

  useEffect(() => {
    subscribe('trades', {
      payload: {coin: symbol},
      handler: (payload) => {
        mergeTrades(processOrderBookTrades(payload));

        
      },
      single: true
    })
  }, [symbol])

  return (
    <div className={styles.orderTradesContainer}>



<div className={styles.orderTradesHeader}>

<div>Price</div>
<div>Size {'(' + symbol + ')'}</div>
<div>Time</div>


</div>  

<BasicDivider />

<div className={`${styles.orderTradesList} ${orderBookMode === 'stacked' ? styles.orderTradesListStacked : ''}`}>
{trades.map((trade) => (
<OrderTradeRow key={trade.tid} trade={trade} />
))}
</div>
    </div>
  );
}

export default OrderBookTrades;
