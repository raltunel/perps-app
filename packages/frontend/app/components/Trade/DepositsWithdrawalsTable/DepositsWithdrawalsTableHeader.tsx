import styles from './DepositsWithdrawalsTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';

export interface HeaderCell {
    name: string;
    key: string;
    sortable: boolean;
    onClick: (() => void) | undefined;
    className: string;
}

export default function DepositsWithdrawalsTableHeader() {
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
            name: 'Status',
            key: 'status',
            sortable: true,
            onClick: () => handleSort('status'),
            className: 'statusCell',
        },
        {
            name: 'Network',
            key: 'network',
            sortable: true,
            onClick: () => handleSort('network'),
            className: 'networkCell',
        },
        {
            name: 'Action',
            key: 'action',
            sortable: true,
            onClick: () => handleSort('action'),
            className: 'actionCell',
        },
        {
            name: 'Account Value Change',
            key: 'valueChange',
            sortable: true,
            onClick: () => handleSort('valueChange'),
            className: 'valueChangeCell',
        },
        {
            name: 'Fee',
            key: 'fee',
            sortable: true,
            onClick: () => handleSort('fee'),
            className: 'feeCell',
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
