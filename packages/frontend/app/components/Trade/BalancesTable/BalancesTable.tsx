import BalancesTableHeader from './BalancesTableHeader';
import BalancesTableRow, { type BalanceData } from './BalancesTableRow';
import styles from './BalancesTable.module.css';
import { balanceData } from './data';
import { useTradeDataStore } from '~/stores/TradeDataStore';
export default function BalancesTable() {
    const { userBalances } = useTradeDataStore();

    return (
        <div className={styles.tableWrapper}>
            <BalancesTableHeader />
            <div className={styles.tableBody}>
                {userBalances.map((balance, index) => (
                    <BalancesTableRow
                        key={`balance-${index}`}
                        balance={balance}
                    />
                ))}

                {userBalances.length === 0 && (
                    <div
                        className={styles.container}
                        style={{ justifyContent: 'center', padding: '2rem 0' }}
                    >
                        No data to display
                    </div>
                )}
            </div>
        </div>
    );
}
