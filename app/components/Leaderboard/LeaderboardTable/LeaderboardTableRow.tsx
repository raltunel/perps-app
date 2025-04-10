import { memo, useMemo } from 'react';
import styles from './LeaderboardTable.module.css';

export interface LeaderboardData {
    rank: number;
    trader: string;
    accountValue: string;
    pnl: string;
    isPnlPositive: boolean;
    roi: string;
    isRoiPositive: boolean;
    volume: string;
}

interface LeaderboardTableRowProps {
    data: LeaderboardData;
}

function LeaderboardTableRow({ data }: LeaderboardTableRowProps) {
    // Pre-compute cell classes to avoid string concatenation on every render
    const cellClasses = useMemo(() => {
        return {
            rank: `${styles.cell} ${styles.rankCell}`,
            trader: `${styles.cell} ${styles.traderCell}`,
            accountValue: `${styles.cell} ${styles.accountValueCell}`,
            pnl: `${styles.cell} ${styles.pnlCell} ${
                data.isPnlPositive ? styles.positive : styles.negative
            }`,
            roi: `${styles.cell} ${styles.roiCell} ${
                data.isRoiPositive ? styles.positive : styles.negative
            }`,
            volume: `${styles.cell} ${styles.volumeCell}`,
        };
    }, [data.isPnlPositive, data.isRoiPositive]);

    // Truncate trader address for display if needed
    const displayTrader = useMemo(() => {
        if (data.trader.length > 20) {
            return `${data.trader.substring(0, 6)}...${data.trader.substring(
                data.trader.length - 4,
            )}`;
        }
        return data.trader;
    }, [data.trader]);

    return (
        <div className={styles.rowContainer}>
            <div className={cellClasses.rank}>{data.rank}</div>
            <div className={cellClasses.trader} title={data.trader}>
                {displayTrader}
            </div>
            <div className={cellClasses.accountValue}>{data.accountValue}</div>
            <div className={cellClasses.pnl}>{data.pnl}</div>
            <div className={cellClasses.roi}>{data.roi}</div>
            <div className={cellClasses.volume}>{data.volume}</div>
        </div>
    );
}

// This only redraws the rows that actually changed. Avoid rerenders when something changes in another row
const areEqual = (
    prevProps: LeaderboardTableRowProps,
    nextProps: LeaderboardTableRowProps,
) => {
    const prevData = prevProps.data;
    const nextData = nextProps.data;

    return (
        prevData.rank === nextData.rank &&
        prevData.trader === nextData.trader &&
        prevData.accountValue === nextData.accountValue &&
        prevData.pnl === nextData.pnl &&
        prevData.isPnlPositive === nextData.isPnlPositive &&
        prevData.roi === nextData.roi &&
        prevData.isRoiPositive === nextData.isRoiPositive &&
        prevData.volume === nextData.volume
    );
};

export default memo(LeaderboardTableRow, areEqual);
