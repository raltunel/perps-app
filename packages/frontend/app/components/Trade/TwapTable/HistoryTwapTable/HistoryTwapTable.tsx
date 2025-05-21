import HistoryTwapTableHeader from './HistoryTwapTableHeader';
import HistoryTwapTableRow from './HistoryTwapTableRow';
import styles from './HistoryTwapTable.module.css';
import type { TwapHistoryIF, UserFillSortBy } from '~/utils/UserDataIFs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Pagination from '~/components/Pagination/Pagination';
import NoDataRow from '~/components/Skeletons/NoDataRow';
import SkeletonTable from '~/components/Skeletons/SkeletonTable/SkeletonTable';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { TableState } from '~/utils/CommonIFs';
import GenericTable from '~/components/Tables/GenericTable/GenericTable';
import { sortTwapHistory } from '~/processors/processUserFills';
interface HistoryTwapTableProps {
    data: TwapHistoryIF[];
    isFetched: boolean;
    selectedFilter?: string;
    pageMode?: boolean;
}

export default function HistoryTwapTable(props: HistoryTwapTableProps) {
    const { data, isFetched, selectedFilter, pageMode } = props;

    const navigate = useNavigate();

    const [tableState, setTableState] = useState<TableState>(
        TableState.LOADING,
    );

    const { symbol } = useTradeDataStore();

    const tableModeLimit = 10;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const { debugWallet } = useDebugStore();

    const currentUserRef = useRef<string>('');
    currentUserRef.current = debugWallet.address;

    const viewAllLink = useMemo(() => {
        return `/twapHistory/${currentUserRef.current}`;
    }, [debugWallet.address]);

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

    useEffect(() => {
        if (isFetched) {
            if (filteredData.length === 0) {
                setTableState(TableState.EMPTY);
            } else {
                setTableState(TableState.FILLED);
            }
        } else {
            setTableState(TableState.LOADING);
        }
    }, [isFetched, filteredData]);

    return (
        <>
            <GenericTable
                data={filteredData as any}
                renderHeader={(sortDirection, sortClickHandler, sortBy) => (
                    <HistoryTwapTableHeader
                        sortBy={sortBy as UserFillSortBy}
                        sortDirection={sortDirection}
                        sortClickHandler={sortClickHandler}
                    />
                )}
                renderRow={(twap, index) => (
                    <HistoryTwapTableRow
                        key={`twap-${index}`}
                        twap={twap as any}
                    />
                )}
                sorterMethod={sortTwapHistory}
                isFetched={isFetched}
                pageMode={pageMode}
                viewAllLink={viewAllLink}
                skeletonRows={7}
                skeletonColRatios={[2, 1, 1, 1, 1, 1, 1, 1]}
            />
        </>
    );
}
