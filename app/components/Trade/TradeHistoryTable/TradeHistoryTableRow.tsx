import styles from './TradeHistoryTable.module.css';
import { HiOutlineExternalLink } from 'react-icons/hi';

export interface TradeHistoryData {
    time: string;
    coin: string;
    direction: 'Long' | 'Short';
    price: string;
    size: string;
    tradeValue: string;
    fee: string;
    closedPnl: string;
    hasOrderDetails?: boolean;
}

interface TradeHistoryTableRowProps {
    trade: TradeHistoryData;
    onViewOrderDetails?: (time: string, coin: string) => void;
}

export default function TradeHistoryTableRow(props: TradeHistoryTableRowProps) {
    const { trade, onViewOrderDetails } = props;

    const handleViewOrderDetails = () => {
        if (onViewOrderDetails && trade.hasOrderDetails) {
            onViewOrderDetails(trade.time, trade.coin);
        }
    };

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell} ${styles.timeCell}`}>
                {trade.time}
                {trade.hasOrderDetails && (
                    <HiOutlineExternalLink
                        className={styles.orderIcon}
                        onClick={handleViewOrderDetails}
                        title='View Order Details'
                    />
                )}
            </div>
            <div className={`${styles.cell} ${styles.coinCell}`}>
                {trade.coin}
            </div>
            <div
                className={`${styles.cell} ${styles.directionCell} ${trade.direction === 'Long' ? styles.longDirection : styles.shortDirection}`}
            >
                {trade.direction}
            </div>
            <div className={`${styles.cell} ${styles.priceCell}`}>
                {trade.price}
            </div>
            <div className={`${styles.cell} ${styles.sizeCell}`}>
                {trade.size}
            </div>
            <div className={`${styles.cell} ${styles.tradeValueCell}`}>
                {trade.tradeValue}
            </div>
            <div className={`${styles.cell} ${styles.feeCell}`}>
                {trade.fee}
            </div>
            <div className={`${styles.cell} ${styles.closedPnlCell}`}>
                {trade.closedPnl}
            </div>
        </div>
    );
}
