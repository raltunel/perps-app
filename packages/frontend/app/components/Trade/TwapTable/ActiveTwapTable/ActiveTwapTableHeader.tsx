import styles from './ActiveTwapTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';

export interface HeaderCell {
    name: string;
    key: string;
    sortable: boolean;
    onClick: (() => void) | undefined;
    className: string;
}

export default function ActiveTwapTableHeader() {
    const handleSort = (key: string) => {
        console.log(`Sorting by: ${key}`);
    };

    const tableHeaders: HeaderCell[] = [
        {
            name: 'Coin',
            key: 'coin',
            sortable: true,
            onClick: () => handleSort('coin'),
            className: styles.coinCell,
        },
        {
            name: 'Size',
            key: 'size',
            sortable: true,
            onClick: () => handleSort('size'),
            className: styles.sizeCell,
        },
        {
            name: 'Executed Size',
            key: 'executedSize',
            sortable: true,
            onClick: () => handleSort('executedSize'),
            className: styles.executedSizeCell,
        },
        {
            name: 'Average Price',
            key: 'averagePrice',
            sortable: true,
            onClick: () => handleSort('averagePrice'),
            className: styles.averagePriceCell,
        },
        {
            name: 'Running Time / Total',
            key: 'runningTime',
            sortable: true,
            onClick: () => handleSort('runningTime'),
            className: styles.runningTimeCell,
        },
        {
            name: 'Reduce Only',
            key: 'reduceOnly',
            sortable: true,
            onClick: () => handleSort('reduceOnly'),
            className: styles.reduceOnlyCell,
        },
        {
            name: 'Creation Time',
            key: 'creationTime',
            sortable: true,
            onClick: () => handleSort('creationTime'),
            className: styles.creationTimeCell,
        },
        {
            name: 'Terminate',
            key: 'terminate',
            sortable: false,
            onClick: undefined,
            className: styles.terminateCell,
        },
    ];

    return (
        <div className={styles.headerContainer}>
            {tableHeaders.map((header) => (
                <div
                    key={header.key}
                    className={`${styles.cell} ${styles.headerCell} ${header.className} ${header.sortable ? styles.sortable : ''}`}
                    onClick={header.onClick}
                >
                    {header.name}
                    {header.sortable && <SortIcon />}
                </div>
            ))}
        </div>
    );
}
