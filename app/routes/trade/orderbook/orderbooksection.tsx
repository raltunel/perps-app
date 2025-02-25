import OrderBook from './orderbook';
import styles from './orderbooksection.module.css';
import OrderTradeHistory from './ordertradehistory';
import Tabs from '~/components/Tabs/Tabs';
interface OrderBookSectionProps {
  symbol: string;
}

const OrderBookSection: React.FC<OrderBookSectionProps> = ({ symbol }) => {
  

    const orderBookComponent = <OrderBook symbol={symbol} orderCount={9} />
    const orderTradeHistoryComponent = <OrderTradeHistory symbol={symbol} />

    const tabs = [
        {
            label: 'Order Book',
            content: orderBookComponent
        },
        {
            label: 'Trades',
            content: orderTradeHistoryComponent
        }
        
    ]


  return (
    <>
    <div className={styles.orderBookSection}>
            <Tabs tabs={tabs} />
    </div>
    </>
  );
}

export default OrderBookSection;
