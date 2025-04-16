import styles from './HistoryTwapTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';

export interface HeaderCell {
    name: string;
    key: string;
    sortable: boolean;
    onClick: (() => void) | undefined;
    className: string;
}

export default function HistoryTwapTableHeader() {
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
            name: 'Total Size',
            key: 'totalSize',
            sortable: true,
            onClick: () => handleSort('totalSize'),
            className: 'totalSizeCell',
        },
        {
            name: 'Executed Size',
            key: 'executedSize',
            sortable: true,
            onClick: () => handleSort('executedSize'),
            className: 'executedSizeCell',
        },
        {
            name: 'Average Price',
            key: 'averagePrice',
            sortable: true,
            onClick: () => handleSort('averagePrice'),
            className: 'averagePriceCell',
        },
        {
            name: 'Total Runtime',
            key: 'totalRuntime',
            sortable: true,
            onClick: () => handleSort('totalRuntime'),
            className: 'totalRuntimeCell',
        },
        {
            name: 'Reduce Only',
            key: 'reduceOnly',
            sortable: true,
            onClick: () => handleSort('reduceOnly'),
            className: 'reduceOnlyCell',
        },
        {
            name: 'Randomize',
            key: 'randomize',
            sortable: true,
            onClick: () => handleSort('randomize'),
            className: 'randomizeCell',
        },
        {
            name: 'Status',
            key: 'status',
            sortable: true,
            onClick: () => handleSort('status'),
            className: 'statusCell',
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
