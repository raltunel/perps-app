import type { TwapHistoryIF } from '~/utils/UserDataIFs';
import styles from './HistoryTwapTable.module.css';
import { useMemo } from 'react';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import useNumFormatter from '~/hooks/useNumFormatter';
import { formatTimestamp } from '~/utils/orderbook/OrderBookUtils';

export interface TwapData {
    time: string;
    coin: string;
    totalSize: string;
    executedSize: string | null;
    averagePrice: string | null;
    totalRuntime: string;
    reduceOnly: string;
    randomize: string;
    status: 'Activated' | 'Terminated' | 'Finished';
}

interface HistoryTwapTableRowProps {
    twap: TwapHistoryIF;
}

export default function HistoryTwapTableRow(props: HistoryTwapTableRowProps) {
    const { twap } = props;
    const { formatNum } = useNumFormatter();

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'activated':
                return styles.statusActivated;
            case 'terminated':
                return styles.statusTerminated;
            case 'finished':
                return styles.statusFinished;
            default:
                return '';
        }
    };

    const avgPrice = useMemo(() => {
        return twap.state.executedSz > 0
            ? formatNum(twap.state.executedNtl / twap.state.executedSz)
            : 0;
    }, [twap.state.executedSz, twap.state.executedNtl]);

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell} ${styles.timeCell}`}>
                {formatTimestamp(twap.state.timestamp)}
            </div>
            <div className={`${styles.cell} ${styles.coinCell}`}>
                {twap.state.coin}
            </div>
            <div className={`${styles.cell} ${styles.totalSizeCell}`}>
                {twap.state.sz} {twap.state.coin}
            </div>
            <div className={`${styles.cell} ${styles.executedSizeCell}`}>
                {twap.state.executedSz ? (
                    <>
                        {formatNum(twap.state.executedSz)} {twap.state.coin}
                    </>
                ) : (
                    <span className={styles.emptyValue}>--</span>
                )}
            </div>
            <div className={`${styles.cell} ${styles.averagePriceCell}`}>
                {avgPrice || <span className={styles.emptyValue}>--</span>}
            </div>
            <div className={`${styles.cell} ${styles.totalRuntimeCell}`}>
                {twap.state.minutes} minutes
            </div>
            <div className={`${styles.cell} ${styles.reduceOnlyCell}`}>
                {twap.state.reduceOnly ? 'Yes' : 'No'}
            </div>
            <div className={`${styles.cell} ${styles.randomizeCell}`}>
                {twap.state.randomize ? 'Yes' : 'No'}
            </div>
            <div
                className={`${styles.cell} ${styles.statusCell} ${getStatusClass(twap.status)}`}
            >
                {twap.status}
            </div>
        </div>
    );
}
