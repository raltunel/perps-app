import type { UserFundingSortBy } from '~/utils/UserDataIFs';
import styles from './FundingHistoryTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';
import type { TableSortDirection } from '~/utils/CommonIFs';

export interface HeaderCell {
    name: string;
    key: string;
    sortable: boolean;
    className: string;
}

interface FundingHistoryTableHeaderProps {
    sortBy?: UserFundingSortBy;
    sortDirection: TableSortDirection;
    sortClickHandler: (key: UserFundingSortBy) => void;
}

export default function FundingHistoryTableHeader(
    props: FundingHistoryTableHeaderProps,
) {
    const { sortBy, sortDirection, sortClickHandler } = props;

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
            name: 'Size',
            key: 'szi',
            sortable: true,
            className: 'sizeCell',
        },
        {
            name: 'Position Side',
            key: 'positionSide',
            sortable: false,
            className: 'positionSideCell',
        },
        {
            name: 'Payment',
            key: 'usdc',
            sortable: true,
            className: 'paymentCell',
        },
        {
            name: 'Rate',
            key: 'fundingRate',
            sortable: true,
            className: 'rateCell',
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
                            sortClickHandler(header.key as UserFundingSortBy);
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
