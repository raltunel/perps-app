import styles from './FillTwapTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';
import type { TableSortDirection } from '~/utils/CommonIFs';
import type { UserFillSortBy } from '~/utils/UserDataIFs';

export interface HeaderCell {
    name: string;
    key: string;
    sortable: boolean;
    className: string;
}

interface FillTwapTableHeaderProps {
    sortBy?: UserFillSortBy;
    sortDirection: TableSortDirection;
    sortClickHandler: (key: UserFillSortBy) => void;
}

export default function FillTwapTableHeader({
    sortBy,
    sortDirection,
    sortClickHandler,
}: FillTwapTableHeaderProps) {
    const tableHeaders: HeaderCell[] = [
        {
            name: 'Time',
            key: 'time',
            sortable: true,
            className: 'timeCell',
        },
        {
            name: 'Coin',
            key: 'coin',
            sortable: true,
            className: 'coinCell',
        },
        {
            name: 'Direction',
            key: 'side',
            sortable: true,
            className: 'directionCell',
        },
        {
            name: 'Price',
            key: 'px',
            sortable: true,
            className: 'priceCell',
        },
        {
            name: 'Size',
            key: 'sz',
            sortable: true,
            className: 'sizeCell',
        },
        {
            name: 'Trade Value',
            key: 'value',
            sortable: true,
            className: 'tradeValueCell',
        },
        {
            name: 'Fee',
            key: 'fee',
            sortable: true,
            className: 'feeCell',
        },
        {
            name: 'Closed PnL',
            key: 'closedPnl',
            sortable: true,
            className: 'closedPnlCell',
        },
    ];

    return (
        <div className={styles.headerContainer}>
            {tableHeaders.map((header) => (
                <div
                    key={header.key}
                    className={`${styles.cell} ${styles.headerCell} ${styles[header.className]} ${header.sortable ? styles.sortable : ''}`}
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
