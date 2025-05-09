import FillTwapTableHeader from './FillTwapTableHeader';
import FillTwapTableRow from './FillTwapTableRow';
import styles from './FillTwapTable.module.css';
import type { TwapSliceFillIF } from '~/utils/UserDataIFs';
import { TableState } from '~/utils/CommonIFs';
import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import SkeletonTable from '~/components/Skeletons/SkeletonTable/SkeletonTable';
import NoDataRow from '~/components/Skeletons/NoDataRow';

interface FillTwapTableProps {
    data: TwapSliceFillIF[];
    isFetched: boolean;
    selectedFilter?: string;
}

export default function FillTwapTable(props: FillTwapTableProps) {
    const { data, isFetched, selectedFilter } = props;

    const { symbol } = useTradeDataStore();

    const tableModeLimit = 10;

    const [tableState, setTableState] = useState<TableState>(
        TableState.LOADING,
    );

    const handleViewAll = () => {
        console.log('View all TWAPs');
    };

    const filteredData = useMemo(() => {
        switch (selectedFilter) {
            case 'all':
                return data;
            case 'active':
                return data.filter((twap) => twap.coin === symbol);
            case 'long':
                return data.filter((twap) => twap.side === 'buy');
            case 'short':
                return data.filter((twap) => twap.side === 'sell');
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
                <SkeletonTable rows={7} colRatios={[2, 1, 1, 1, 1, 1, 1, 1]} />
            ) : (
                <>
                    <FillTwapTableHeader />
                    <div className={styles.tableBody}>
                        {tableState === TableState.FILLED && (
                            <>
                                {dataToShow.map((fill, index) => (
                                    <FillTwapTableRow
                                        key={`fill-${index}`}
                                        fill={fill}
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
