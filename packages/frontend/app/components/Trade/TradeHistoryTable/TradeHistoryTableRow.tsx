import type { UserFillIF } from '~/utils/UserDataIFs';
import styles from './TradeHistoryTable.module.css';
import { HiOutlineExternalLink } from 'react-icons/hi';
import useNumFormatter from '~/hooks/useNumFormatter';
import { formatTimestamp } from '~/utils/orderbook/OrderBookUtils';
import { useAppSettings } from '~/stores/AppSettingsStore';

interface TradeHistoryTableRowProps {
    trade: UserFillIF;
    onViewOrderDetails?: (time: string, coin: string) => void;
}

export default function TradeHistoryTableRow(props: TradeHistoryTableRowProps) {
    const { trade, onViewOrderDetails } = props;

    const { formatNum } = useNumFormatter();

    const { getBsColor } = useAppSettings();

    const handleViewOrderDetails = () => {
        // if (onViewOrderDetails && trade.hasOrderDetails) {
        //     onViewOrderDetails(trade.time, trade.coin);
        // }
    };
    ('');

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell} ${styles.timeCell}`}>
                {formatTimestamp(trade.time)}
                {/* {trade.hasOrderDetails && (
                    <HiOutlineExternalLink
                        className={styles.orderIcon}
                        onClick={handleViewOrderDetails}
                        title='View Order Details'
                    />
                )} */}
            </div>
            <div className={`${styles.cell} ${styles.coinCell}`}>
                {trade.coin}
            </div>
            <div
                className={`${styles.cell} ${styles.directionCell}`}
                style={{
                    color:
                        trade.side === 'buy'
                            ? getBsColor().buy
                            : getBsColor().sell,
                }}
            >
                {trade.dir}
            </div>
            <div className={`${styles.cell} ${styles.priceCell}`}>
                {formatNum(trade.px)}
            </div>
            <div className={`${styles.cell} ${styles.sizeCell}`}>
                {formatNum(trade.sz)}
            </div>
            <div className={`${styles.cell} ${styles.tradeValueCell}`}>
                {formatNum(trade.value, null, true, true)}
            </div>
            <div className={`${styles.cell} ${styles.feeCell}`}>
                {formatNum(trade.fee)}
            </div>
            <div className={`${styles.cell} ${styles.closedPnlCell}`}>
                {formatNum(trade.closedPnl, 2, true, true)}
            </div>
        </div>
    );
}
