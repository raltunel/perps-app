import BalancesTableHeader from './BalancesTableHeader';
import BalancesTableRow, { type BalanceData } from './BalancesTableRow';
import styles from './BalancesTable.module.css';
import { balanceData } from './data';

export default function BalancesTable() {
    return (
        <div className={styles.tableWrapper}>
            <BalancesTableHeader />
            <div className={styles.tableBody}>
                {balanceData.map((balance, index) => (
                    <BalancesTableRow
                        key={`balance-${index}`}
                        balance={balance}
                    />
                ))}

                {balanceData.length === 0 && (
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
