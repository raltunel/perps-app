import OrderBook from './orderbook';
import styles from './orderbooksection.module.css';

interface OrderBookSectionProps {
  symbol: string;
}

const OrderBookSection: React.FC<OrderBookSectionProps> = ({ symbol }) => {



  return (
    <>
    <div className={styles.orderBookSection}>
        <div className={styles.orderBookSectionHeader}>
            
        </div>
        <OrderBook symbol={symbol} />
    </div>
    </>
  );
}

export default OrderBookSection;
