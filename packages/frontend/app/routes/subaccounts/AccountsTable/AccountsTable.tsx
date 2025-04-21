import { useNavigate } from 'react-router';
import styles from './AccountsTable.module.css';
import { motion } from 'framer-motion';
import Tabs from '~/components/Tabs/Tabs';
import SortIcon from '~/components/Vault/SortIcon';
import type { accountIF } from '~/routes/subaccounts/subaccounts';
import { useMemo, useState } from 'react';
export interface headerItemIF {
    name: string;
    key: string;
    sortable: boolean;
    onClick: (() => void) | undefined;
    className: string;
}

const tableHeaders: headerItemIF[] = [
    {
        name: 'Name',
        key: 'name',
        sortable: true,
        onClick: () => null,
        className: '',
    },
    {
        name: 'Address',
        key: 'address',
        sortable: false,
        onClick: () => null,
        className: '',
    },
    {
        name: 'Account Equity',
        key: 'accountEquity',
        sortable: true,
        onClick: () => null,
        className: '',
    },
    {
        name: '',
        key: 'tradeLink',
        sortable: false,
        onClick: () => null,
        className: '',
    },
];

interface propsIF {
    title: string;
    accounts: accountIF[];
    noSort?: boolean;
}

export default function PortfolioTable(props: propsIF) {
    const {
        title,
        accounts,
        noSort,
    } = props;

    const navigate = useNavigate();

    interface sortByIF {
        cell: typeof tableHeaders[number]['key'];
        reverse: boolean;
    }

    const [sortBy, setSortBy] = useState<null|sortByIF>(null);

    const sorted = useMemo<accountIF[]>(() => {
        if (!sortBy) return accounts;

        let output: accountIF[];

        if (sortBy) {
            if (sortBy.cell === 'name') {
                output = [...accounts].sort(
                    (a: accountIF, b: accountIF) => a.name.toLowerCase().localeCompare(b.name.toLocaleLowerCase())
                );
            } else if (sortBy.cell === 'accountEquity') {
                output = [...accounts].sort(
                    (a: accountIF, b: accountIF) => a.equity.toLowerCase().localeCompare(b.equity.toLocaleLowerCase())
                );
            } else {
                output = accounts;
            }
        } else {
            output = accounts;
        }

        return sortBy.reverse ? output.reverse() : output;
    }, [sortBy]);

    function checkSortDirection(col: typeof tableHeaders[number]['key']): 'asc'|'desc'|'' {
        if (!sortBy) return '';

        let output: 'asc'|'desc'|'' = '';

        if (col === sortBy.cell) {
            output = sortBy.reverse ? 'asc' : 'desc';
        }

        return output;
    }

    return (
        <div className={styles.table_wrapper}>
            <Tabs
                tabs={[title]}
                defaultTab={title}
                onTabChange={() => null}
                rightContent={<></>}
            />
            <motion.div
                className={styles.table_content}
                key={title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <div className={styles.tableWrapper}>
                    <div className={styles.col_headers_row}>
                        {tableHeaders.map((header: headerItemIF) => (
                            <div
                                key={header.key}
                                style={{ cursor: noSort ? 'default' : 'pointer' }}
                                className={header.sortable ? styles.sortable : ''}
                                onClick={() => {
                                    let output: null|sortByIF = null;
                                    if (sortBy) {
                                        output = {
                                            cell: header.key,
                                            reverse: !sortBy.reverse,
                                        };
                                    } else {
                                        output = {
                                            cell: header.key,
                                            reverse: false,
                                        };
                                    }
                                    setSortBy(output);
                                }}
                            >
                                {header.name}
                                {header.sortable && !noSort &&
                                    <SortIcon
                                        sortDirection={checkSortDirection(header.key)}
                                    />
                                }
                            </div>
                        ))}
                    </div>
                    <div className={styles.table_body}>
                        {sorted.map((acct) => (
                            <div key={JSON.stringify(acct)} className={styles.table_row}>
                                <div>{acct.name}</div>
                                <div>{acct.address}</div>
                                <div>{acct.equity}</div>
                                <div
                                    style={{
                                        justifyContent: 'flex-end',
                                        color: 'var(--accent1)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => navigate('/trade')}
                                >
                                    Trade
                                </div>
                            </div>
                        ))}

                        {sorted.length === 0 && (
                            <div
                                className={styles.container}
                                style={{
                                    justifyContent: 'center',
                                    padding: '2rem 0',
                                }}
                            >
                                No data to display
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
