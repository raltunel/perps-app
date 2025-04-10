import type { PositionIF } from '~/utils/position/PositionIFs';
import styles from './PositionsTable.module.css';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useMemo } from 'react';
import { useNumFormatter } from '~/hooks/useNumFormatter';
import { useAppSettings } from '~/stores/AppSettingsStore';

interface PositionsTableRowProps {
    position: PositionIF;
}

export default function PositionsTableRow(props: PositionsTableRowProps) {
    const { position } = props;
    const { coins } = useTradeDataStore();
    const { formatNum } = useNumFormatter();
    const { getBsColor } = useAppSettings();

    // TODO that block may optimized after adding hashmap for coins
    const coinPrice = useMemo(() => {
        const price = coins.find((c) => c.coin === position.coin)?.markPx;
        return formatNum(price ?? 0);
    }, [coins, position.coin]);

    // TODO tpsl will be added after finding a sample
    const tpsl = '--/--';

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell} ${styles.coinCell}`}>
                {position.coin}
                {position.leverage.value && (
                    <span className={styles.badge}>
                        {position.leverage.value}x
                    </span>
                )}
            </div>
            <div className={`${styles.cell} ${styles.sizeCell}`}>
                {position.szi} {position.coin}
            </div>
            <div className={`${styles.cell} ${styles.positionValueCell}`}>
                ${formatNum(position.positionValue)}
            </div>
            <div className={`${styles.cell} ${styles.entryPriceCell}`}>
                {formatNum(position.entryPx)}
            </div>
            <div className={`${styles.cell} ${styles.markPriceCell}`}>
                {coinPrice}
            </div>
            <div
                className={`${styles.cell} ${styles.pnlCell}`}
                style={{
                    color:
                        position.unrealizedPnl > 0
                            ? getBsColor().buy
                            : position.unrealizedPnl < 0
                              ? getBsColor().sell
                              : 'var(--text2)',
                }}
            >
                {formatNum(position.unrealizedPnl, 2)} (
                {formatNum(position.returnOnEquity * 100, 1)}%)
            </div>
            <div className={`${styles.cell} ${styles.liqPriceCell}`}>
                {formatNum(position.liquidationPx)}
            </div>
            <div className={`${styles.cell} ${styles.marginCell}`}>
                {formatNum(position.marginUsed, 2)}
            </div>
            <div
                className={`${styles.cell} ${styles.fundingCell}`}
                style={{
                    color:
                        position.cumFunding.allTime > 0
                            ? getBsColor().buy
                            : position.cumFunding.allTime < 0
                              ? getBsColor().sell
                              : 'var(--text2)',
                }}
            >
                ${formatNum(position.cumFunding.allTime, 2)}
            </div>
            <div className={`${styles.cell} ${styles.tpslCell}`}>{tpsl}</div>
            <div className={`${styles.cell} ${styles.closeCell}`}>
                <div className={styles.actionContainer}>
                    <button className={styles.actionButton}>Limit</button>
                    <button className={styles.actionButton}>Market</button>
                </div>
            </div>
        </div>
    );
}
