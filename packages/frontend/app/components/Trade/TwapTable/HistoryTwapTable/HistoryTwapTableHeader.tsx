import type { TableSortDirection } from '~/utils/CommonIFs';
import styles from './HistoryTwapTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';
import type { UserFillSortBy } from '~/utils/UserDataIFs';

export interface HeaderCell {
    name: string;
    key: string;
    sortable: boolean;
    className: string;
}

interface HistoryTwapTableHeaderProps {
    sortBy?: UserFillSortBy;
    sortDirection: TableSortDirection;
    sortClickHandler: (key: UserFillSortBy) => void;
}

export default function HistoryTwapTableHeader({
    sortBy,
    sortDirection,
    sortClickHandler,
}: HistoryTwapTableHeaderProps) {
    const tableHeaders: HeaderCell[] = [
        {
            name: 'Time',
            key: 'time',
            sortable: true,
            className: styles.timeCell,
        },
        {
            name: 'Coin',
            key: 'coin',
            sortable: true,
            className: styles.coinCell,
        },
        {
            name: 'Total Size',
            key: 'side',
            sortable: true,
            className: styles.totalSizeCell,
        },
        {
            name: 'Executed Size',
            key: 'px',
            sortable: true,
            className: styles.executedSizeCell,
        },
        {
            name: 'Average Price',
            key: 'sz',
            sortable: true,
            className: styles.averagePriceCell,
        },
        {
            name: 'Total Runtime',
            key: 'value',
            sortable: true,
            className: styles.totalRuntimeCell,
        },
        {
            name: 'Reduce Only',
            key: 'fee',
            sortable: true,
            className: styles.reduceOnlyCell,
        },
        {
            name: 'Randomize',
            key: 'closedPnl',
            sortable: true,
            className: styles.randomizeCell,
        },
        {
            name: 'Status',
            key: 'status',
            sortable: true,
            className: styles.statusCell,
        },
    ];

    return (
        <div className={styles.headerContainer}>
            {tableHeaders.map((header) => (
                <div
                    key={header.key}
                    className={`${styles.cell} ${styles.headerCell} ${header.className} ${header.sortable ? styles.sortable : ''}`}
                    onClick={() => {
                        if (header.sortable) {
                            sortClickHandler(header.key as UserFillSortBy);
                        }
                    }}
                >
                    {header.name}
                    {header.sortable && (
                        <SortIcon
                            sortDirection={
                                sortDirection && header.key === sortBy
                                    ? sortDirection
                                    : undefined
                            }
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
