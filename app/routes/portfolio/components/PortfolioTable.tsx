import styles from './PortfolioTable.module.css';
import { motion } from 'framer-motion';
import Tabs from '~/components/Tabs/Tabs';
import SortIcon from '~/components/Vault/SortIcon';
import type { accountIF } from '~/routes/subaccounts/subaccounts';

export interface FilterOption {
    id: string;
    label: string;
}

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
}

export default function PortfolioTable(props: propsIF) {
    const { title, accounts } = props;

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
                    <div className={styles.headerContainer}>
                        {tableHeaders.map((header: headerItemIF) => (
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
                    <div className={styles.tableBody}>
                        {accounts.map((acct) => (
                            <div className={styles.rowContainer}>
                                <div className={styles.cell}>
                                    {acct.name}
                                </div>
                                <div className={styles.cell}>
                                    {acct.address}
                                </div>
                                <div className={styles.cell}>
                                    {acct.equity}
                                </div>
                                <div onClick={() => console.log('user clicked trade')}>
                                    Trade
                                </div>
                            </div>
                        ))}

                        {accounts.length === 0 && (
                            <div
                                className={styles.container}
                                style={{ justifyContent: 'center', padding: '2rem 0' }}
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
