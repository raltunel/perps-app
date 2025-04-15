import styles from './MasterAccount.module.css';
import BalancesTableHeader from '~/components/Trade/BalancesTable/BalancesTableHeader';
import BalancesTableRow from '~/components/Trade/BalancesTable/BalancesTableRow';
import { balanceData } from '~/components/Trade/BalancesTable/data';

export default function MasterAccount() {
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
