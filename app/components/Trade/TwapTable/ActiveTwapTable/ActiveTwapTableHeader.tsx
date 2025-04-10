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
            name: 'Running Time / Total',
            key: 'runningTime',
            sortable: true,
            onClick: () => handleSort('runningTime'),
            className: 'runningTimeCell',
        },
        {
            name: 'Reduce Only',
            key: 'reduceOnly',
            sortable: true,
            onClick: () => handleSort('reduceOnly'),
            className: 'reduceOnlyCell',
        },
        {
            name: 'Creation Time',
            key: 'creationTime',
            sortable: true,
            onClick: () => handleSort('creationTime'),
            className: 'creationTimeCell',
        },
        {
            name: 'Terminate',
            key: 'terminate',
            sortable: false,
            onClick: undefined,
            className: 'terminateCell',
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
