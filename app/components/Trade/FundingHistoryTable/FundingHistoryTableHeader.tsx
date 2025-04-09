import styles from './FundingHistoryTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';

export interface HeaderCell {
    name: string;
    key: string;
    sortable: boolean;
    onClick: (() => void) | undefined;
    className: string;
}

export default function FundingHistoryTableHeader() {
    const handleSort = (key: string) => {
        console.log(`Sorting by: ${key}`);
    };

    const tableHeaders: HeaderCell[] = [
        {
            name: 'Time',
            key: 'time',
            sortable: true,
            onClick: () => handleSort('time'),
            className: 'timeCell',
        },
        {
            name: 'Coin',
            key: 'coin',
            sortable: true,
            onClick: () => handleSort('coin'),
            className: 'coinCell',
        },
        {
            name: 'Size',
            key: 'size',
            sortable: true,
            onClick: () => handleSort('size'),
            className: 'sizeCell',
        },
        {
            name: 'Position Side',
            key: 'positionSide',
            sortable: true,
            onClick: () => handleSort('positionSide'),
            className: 'positionSideCell',
        },
        {
            name: 'Payment',
            key: 'payment',
            sortable: true,
            onClick: () => handleSort('payment'),
            className: 'paymentCell',
        },
        {
            name: 'Rate',
            key: 'rate',
            sortable: true,
            onClick: () => handleSort('rate'),
            className: 'rateCell',
        },
    ];

    return (
        <div className={styles.headerContainer}>
            {tableHeaders.map((header) => (
                <div
                    key={header.key}
                    className={`${styles.cell} ${styles.headerCell} ${styles[header.className]} ${header.sortable ? styles.sortable : ''}`}
                    onClick={header.onClick}
                >
                    {header.name}
                    {header.sortable && <SortIcon />}
                </div>
            ))}
        </div>
    );
}
