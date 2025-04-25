import type { UserBalanceIF } from '~/utils/UserDataIFs';
import styles from './BalancesTable.module.css';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useMemo } from 'react';
import { parseNum } from '~/utils/orderbook/OrderBookUtils';
interface BalancesTableRowProps {
    balance: UserBalanceIF;
}

export default function BalancesTableRow(props: BalancesTableRowProps) {
    const { balance } = props;

    const { coinPriceMap } = useTradeDataStore();
    const { formatNum } = useNumFormatter();

    const balanceValue = useMemo(() => {
        if (!coinPriceMap) {
            return 0;
        }
        const price = coinPriceMap.get(balance.coin);
        if (!price) {
            return 0;
        }
        return balance.total * price;
    }, [coinPriceMap, balance.coin, balance.total]);

    const pnlVal = useMemo(() => {
        if (balance.entryNtl > 0) {
            return parseNum(balanceValue) - balance.entryNtl;
        }
        return 0;
    }, [balanceValue, balance.entryNtl]);

    const pnlStr = useMemo(() => {
        if (balance.entryNtl > 0) {
            return `${formatNum(pnlVal, 2, true, true)} (${formatNum(pnlVal / balance.entryNtl, 2)}%)`;
        }
        return '';
    }, [pnlVal]);

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell} ${styles.coinCell}`}>
                {balance.coin}
            </div>
            <div className={`${styles.cell} ${styles.totalBalanceCell}`}>
                {formatNum(balance.total)} {balance.coin}
            </div>
            <div className={`${styles.cell} ${styles.availableBalanceCell}`}>
                {formatNum(balance.total - balance.hold)}
            </div>
            <div className={`${styles.cell} ${styles.usdcValueCell}`}>
                {formatNum(balanceValue, null, true, true)}
            </div>
            <div className={`${styles.cell} ${styles.buyingPowerCell}`}>
                {formatNum(balanceValue, null, true, true)}
            </div>
            <div
                className={`${styles.cell} ${styles.pnlCell} ${pnlVal > 0 ? styles.positive : pnlVal < 0 ? styles.negative : ''}`}
            >
                {pnlStr}
            </div>
            <div className={`${styles.cell} ${styles.contractCell}`}>
                {balance.coin}
            </div>
            <div className={`${styles.cell} ${styles.actionCell}`}>
                <button className={styles.sendButton}>Send</button>
            </div>
        </div>
    );
}
