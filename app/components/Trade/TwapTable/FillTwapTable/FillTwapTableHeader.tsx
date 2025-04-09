import styles from './FillTwapTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';

export interface HeaderCell {
    name: string;
    key: string;
    sortable: boolean;
    onClick: (() => void) | undefined;
    className: string;
}

export default function FillTwapTableHeader() {
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
            name: 'Direction',
            key: 'direction',
            sortable: true,
            onClick: () => handleSort('direction'),
            className: 'directionCell',
        },
        {
            name: 'Price',
            key: 'price',
            sortable: true,
            onClick: () => handleSort('price'),
            className: 'priceCell',
        },
        {
            name: 'Size',
            key: 'size',
            sortable: true,
            onClick: () => handleSort('size'),
            className: 'sizeCell',
        },
        {
            name: 'Trade Value',
            key: 'tradeValue',
            sortable: true,
            onClick: () => handleSort('tradeValue'),
            className: 'tradeValueCell',
        },
        {
            name: 'Fee',
            key: 'fee',
            sortable: true,
            onClick: () => handleSort('fee'),
            className: 'feeCell',
        },
        {
            name: 'Closed PNL',
            key: 'closedPnl',
            sortable: true,
            onClick: () => handleSort('closedPnl'),
            className: 'closedPnlCell',
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
