import type { UserFillSortBy } from '~/utils/UserDataIFs';
import styles from './TradeHistoryTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';
import type { HeaderCell, TableSortDirection } from '~/utils/CommonIFs';
import { formatTimestamp } from '~/utils/orderbook/OrderBookUtils';

interface TradeHistoryTableHeaderProps {
    sortBy?: UserFillSortBy;
    sortDirection: TableSortDirection;
    sortClickHandler: (key: UserFillSortBy) => void;
}

export const TradeHistoryTableModel:
    | HeaderCell<number>[]
    | HeaderCell<string>[] = [
    {
        name: 'Time',
        key: 'time',
        sortable: true,
        className: 'timeCell',
        exportable: true,
        exportAction: (data: number) => {
            return formatTimestamp(data);
        },
    } as HeaderCell<number>,
    {
        name: 'Coin',
        key: 'coin',
        sortable: true,
        className: 'coinCell',
        exportable: true,
    },
    {
        name: 'Direction',
        key: 'dir',
        sortable: true,
        className: 'directionCell',
        exportable: true,
    },
    {
        name: 'Price',
        key: 'px',
        sortable: true,
        className: 'priceCell',
        exportable: true,
    },
    {
        name: 'Size',
        key: 'sz',
        sortable: true,
        className: 'sizeCell',
        exportable: true,
    },
    {
        name: 'Trade Value',
        key: 'value',
        sortable: true,
        className: 'tradeValueCell',
        exportable: true,
    },
    {
        name: 'Fee',
        key: 'fee',
        sortable: true,
        className: 'feeCell',
        exportable: true,
    },
    {
        name: 'Closed PNL',
        key: 'closedPnl',
        sortable: true,
        className: 'closedPnlCell',
        exportable: true,
    },
];

export default function TradeHistoryTableHeader({
    sortBy,
    sortDirection,
    sortClickHandler,
}: TradeHistoryTableHeaderProps) {
    return (
        <div className={styles.headerContainer}>
            {TradeHistoryTableModel.map((header) => (
                <div
                    key={header.key}
                    className={`${styles.cell} ${styles.headerCell} ${styles[header.className]} ${header.sortable ? styles.sortable : ''} ${header.key === sortBy ? styles.active : ''}`}
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
