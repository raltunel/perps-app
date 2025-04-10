import styles from './TradeHistoryTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';

export interface HeaderCell {
    name: string;
    key: string;
    sortable: boolean;
    onClick: (() => void) | undefined;
    className: string;
}

export default function TradeHistoryTableHeader() {
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
            sortable: false,
            onClick: undefined,
            className: 'coinCell',
        },
        {
            name: 'Direction',
            key: 'direction',
            sortable: false,
            onClick: undefined,
            className: 'directionCell',
        },
        {
            name: 'Price',
            key: 'price',
            sortable: false,
            onClick: undefined,
            className: 'priceCell',
        },
        {
            name: 'Size',
            key: 'size',
            sortable: false,
            onClick: undefined,
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
            sortable: false,
            onClick: undefined,
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
