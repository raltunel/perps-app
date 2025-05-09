import HistoryTwapTableHeader from './HistoryTwapTableHeader';
import HistoryTwapTableRow from './HistoryTwapTableRow';
import styles from './HistoryTwapTable.module.css';
import type { TwapHistoryIF } from '~/utils/UserDataIFs';
import { useEffect, useMemo, useState } from 'react';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { TableState } from '~/utils/CommonIFs';
import SkeletonTable from '~/components/Skeletons/SkeletonTable/SkeletonTable';
import NoDataRow from '~/components/Skeletons/NoDataRow';

interface HistoryTwapTableProps {
    data: TwapHistoryIF[];
    isFetched: boolean;
    selectedFilter?: string;
}

export default function HistoryTwapTable(props: HistoryTwapTableProps) {
    const { data, isFetched, selectedFilter } = props;

    const [tableState, setTableState] = useState<TableState>(
        TableState.LOADING,
    );

    const { symbol } = useTradeDataStore();

    const tableModeLimit = 10;

    const handleViewAll = () => {
        console.log('View all TWAPs');
    };

    const filteredData = useMemo(() => {
        switch (selectedFilter) {
            case 'all':
                return data;
            case 'active':
                return data.filter((twap) => twap.state.coin === symbol);
            case 'long':
                return data.filter((twap) => twap.state.side === 'buy');
            case 'short':
                return data.filter((twap) => twap.state.side === 'sell');
        }
        return data;
    }, [data, selectedFilter, symbol]);

    const sortedData = useMemo(() => {
        return filteredData;
    }, [filteredData]);

    const dataToShow = useMemo(() => {
        return sortedData.slice(0, tableModeLimit);
    }, [sortedData]);

    useEffect(() => {
        if (isFetched) {
            if (dataToShow.length === 0) {
                setTableState(TableState.EMPTY);
            } else {
                setTableState(TableState.FILLED);
            }
        } else {
            setTableState(TableState.LOADING);
        }
    }, [isFetched, dataToShow]);

    return (
        <div className={styles.tableWrapper}>
            {tableState === TableState.LOADING ? (
                <SkeletonTable
                    rows={7}
                    colRatios={[2, 1, 1.5, 1.5, 1.5, 1.5, 1, 1, 1]}
                />
            ) : (
                <>
                    <HistoryTwapTableHeader />
                    <div className={styles.tableBody}>
                        {tableState === TableState.FILLED && (
                            <>
                                {dataToShow.map((twap, index) => (
                                    <HistoryTwapTableRow
                                        key={`twap-${index}`}
                                        twap={twap}
                                    />
                                ))}
                            </>
                        )}
                        {tableState === TableState.EMPTY && <NoDataRow />}
                    </div>

                    {filteredData.length > tableModeLimit && (
                        <div
                            className={styles.viewAllLink}
                            onClick={handleViewAll}
                        >
                            View All
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
