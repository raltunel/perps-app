import BalancesTableHeader from './BalancesTableHeader';
import BalancesTableRow, { type BalanceData } from './BalancesTableRow';
import styles from './BalancesTable.module.css';
import { balanceData } from './data';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useMemo, useState } from 'react';
import type { UserBalanceSortBy } from '~/utils/UserDataIFs';
import type { TableSortDirection } from '~/utils/CommonIFs';
import { sortUserBalances } from '~/processors/processUserBalance';
export default function BalancesTable() {
    const { userBalances } = useTradeDataStore();

    const [sortBy, setSortBy] = useState<UserBalanceSortBy>();
    const [sortDirection, setSortDirection] = useState<TableSortDirection>();

    const handleSort = (key: string) => {
        if (sortBy === key) {
            if (sortDirection === 'desc') {
                setSortDirection('asc');
            } else if (sortDirection === 'asc') {
                setSortDirection(undefined);
                setSortBy(undefined);
            } else {
                setSortDirection('desc');
            }
        } else {
            setSortBy(key as UserBalanceSortBy);
            setSortDirection('desc');
        }
    };

    const sortedBalances = useMemo(() => {
        return sortUserBalances(userBalances, sortBy, sortDirection);
    }, [userBalances, sortBy, sortDirection]);

    return (
        <div className={styles.tableWrapper}>
            <BalancesTableHeader
                sortBy={sortBy}
                sortDirection={sortDirection}
                sortClickHandler={handleSort}
            />
            <div className={styles.tableBody}>
                {sortedBalances.map((balance, index) => (
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
