import OrderBook from './orderbook';
import styles from './orderbooksection.module.css';
import OrderBookTrades from './orderbooktrades';
import Tabs from '~/components/Tabs/Tabs';
interface OrderBookSectionProps {
  symbol: string;
}

const OrderBookSection: React.FC<OrderBookSectionProps> = ({ symbol }) => {
  

    const orderBookComponent = <OrderBook symbol={symbol} orderCount={9} />
    const orderBookTrades = <OrderBookTrades symbol={symbol} />

    const tabs = [
        {
            label: 'Order Book',
            content: orderBookComponent
        },
        {
            label: 'Trades',
            content: orderBookTrades
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
