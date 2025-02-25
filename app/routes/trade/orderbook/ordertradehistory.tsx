
import styles from './ordertradehistory.module.css';

interface OrderTradeHistoryProps {
  symbol: string;
}

const OrderTradeHistory: React.FC<OrderTradeHistoryProps> = ({ symbol }) => {

  return (
    <div>
        order trade history {symbol}
    </div>
  );
}

export default OrderTradeHistory;
