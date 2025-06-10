import {
    useStrategiesStore,
    type strategyDecoratedIF,
} from '~/stores/StrategiesStore';
import styles from './strategies.module.css';
import { useNavigate } from 'react-router';
import Tabs from '~/components/Tabs/Tabs';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import SortIcon from '~/components/Vault/SortIcon';
import SimpleButton from '~/components/SimpleButton/SimpleButton';

// interface for table column header metadata
export interface headerItemIF {
    name: string;
    key: string;
    sortable: boolean;
}

// data to label column headers
const tableHeaders: headerItemIF[] = [
    {
        name: 'Name',
        key: 'name',
        sortable: true,
    },
    // would this be better as a filter than a sort?
    {
        name: 'Status',
        key: 'status',
        sortable: true,
    },
    {
        name: 'Collateral',
        key: 'collateral',
        sortable: true,
    },
    {
        name: 'Volume',
        key: 'volume',
        sortable: true,
    },
    {
        name: 'PnL',
        key: 'pnl',
        sortable: true,
    },
];

export default function Strategies() {
    const navigate = useNavigate();

    const { data } = useStrategiesStore();

    // data structure for the active sort methodology, putting both values
    // ... in a unified structure allows them to update concurrently
    interface sortByIF {
        cell: (typeof tableHeaders)[number]['key'];
        reverse: boolean;
    }
    const [sortBy, setSortBy] = useState<null | sortByIF>(null);

    // memoized record of sorted data, updates when the user changes the
    // ... active sort method or direction
    const sorted = useMemo<strategyDecoratedIF[]>(() => {
        // only return native unsorted sequence if `noSort` prop is passed
        if (!sortBy) return data;
        // declare an output variable
        let output: strategyDecoratedIF[];
        // assignment tree for output variable
        if (sortBy.cell === 'name') {
            output = [...data].sort(
                (a: strategyDecoratedIF, b: strategyDecoratedIF) =>
                    a.name
                        .toLowerCase()
                        .localeCompare(b.name.toLocaleLowerCase()),
            );
        } else if (sortBy.cell === 'status') {
            output = [...data].sort(
                (a: strategyDecoratedIF, b: strategyDecoratedIF) => {
                    if (a.isPaused && b.isPaused) {
                        return 0;
                    } else if (a.isPaused) {
                        return 1;
                    } else if (b.isPaused) {
                        return -1;
                    } else {
                        return 0;
                    }
                },
            );
        } else if (sortBy.cell === 'collateral') {
            output = [...data].sort(
                (a: strategyDecoratedIF, b: strategyDecoratedIF) =>
                    a.collateral
                        .toLowerCase()
                        .localeCompare(b.collateral.toLocaleLowerCase()),
            );
        } else {
            output = data;
        }
        // return sorted data, reverse the sequence if relevant
        return sortBy.reverse ? output.reverse() : output;
    }, [data, sortBy]);

    // fn to determine whether the sort direction is inverted
    function checkSortDirection(
        col: (typeof tableHeaders)[number]['key'],
    ): 'asc' | 'desc' | '' {
        // functionality is irrelevant if no sort is active
        if (!sortBy) return '';
        // declare an output variable, fallback val will highlight neither arrow
        let output: 'asc' | 'desc' | '' = '';
        // return `asc` or `desc` to mark arrow indicating direction
        if (col === sortBy.cell) {
            output = sortBy.reverse ? 'asc' : 'desc';
        }
        // return output
        return output;
    }

    return (
        <div className={styles.strategies_page}>
            <header>
                <div className={styles.title_row}>
                    <h2>Strategies</h2>
                    <SimpleButton
                        onClick={() => navigate('/strategies/new')}
                        hoverBg='accent1'
                    >
                        Create Strategy
                    </SimpleButton>
                </div>
                <p className={styles.blurb}>
                    Run an automated market making strategy on Ambient Perps
                </p>
                <p className={styles.learn_more}>Learn more</p>
            </header>
            <div className={styles.table_wrapper}>
                <Tabs
                    tabs={['Strategies']}
                    defaultTab={'Strategies'}
                    onTabChange={() => null}
                    rightContent={<></>}
                    wrapperId={'strategies_table'}
                />
                <motion.div
                    className={styles.table_content}
                    key={'Strategies'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className={styles.col_headers_row}>
                        {tableHeaders.map((header: headerItemIF) => (
                            <div
                                key={header.key}
                                onClick={() => {
                                    let output: null | sortByIF = null;
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
                                {header.sortable && (
                                    <SortIcon
                                        sortDirection={checkSortDirection(
                                            header.key,
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <ol className={styles.table_body}>
                        {sorted.map((strat: strategyDecoratedIF) => (
                            <li
                                key={JSON.stringify(strat)}
                                onClick={() =>
                                    navigate('/strategies/' + strat.address)
                                }
                            >
                                <div>{strat.name}</div>
                                <div>
                                    {strat.isPaused ? 'Paused' : 'Running'}
                                </div>
                                <div>{strat.collateral}</div>
                                <div>{strat.volume}</div>
                                <div>{strat.pnl}</div>
                            </li>
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
                    </ol>
                </motion.div>
            </div>
        </div>
    );
}
