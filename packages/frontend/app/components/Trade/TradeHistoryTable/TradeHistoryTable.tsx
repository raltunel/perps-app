import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './TradeHistoryTable.module.css';
import TradeHistoryTableHeader from './TradeHistoryTableHeader';
import TradeHistoryTableRow from './TradeHistoryTableRow';
import { tradeHistoryData } from './data';
import type { UserFillIF, UserFillSortBy } from '~/utils/UserDataIFs';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { sortUserFills } from '~/processors/processUserFills';
import type { TableSortDirection } from '~/utils/CommonIFs';
import { TableState } from '~/utils/CommonIFs';
import SkeletonTable from '~/components/Skeletons/SkeletonTable/SkeletonTable';
import { useNavigate } from 'react-router';
import { useDebugStore } from '~/stores/DebugStore';
import Pagination from '~/components/Pagination/Pagination';
interface TradeHistoryTableProps {
    data: UserFillIF[];
    isFetched: boolean;
    selectedFilter?: string;
    onViewOrderDetails?: (time: string, coin: string) => void;
    onViewAll?: () => void;
    onExportCsv?: () => void;
    pageMode?: boolean;
}

export default function TradeHistoryTable(props: TradeHistoryTableProps) {
    const {
        data,
        isFetched,
        selectedFilter,
        onViewOrderDetails,
        onViewAll,
        onExportCsv,
        pageMode,
    } = props;

    const { symbol } = useTradeDataStore();

    const tableModeLimit = 10;

    const navigate = useNavigate();

    const { debugWallet } = useDebugStore();

    const currentUserRef = useRef<string>('');
    currentUserRef.current = debugWallet.address;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const [tableState, setTableState] = useState<TableState>(
        TableState.LOADING,
    );

    const [sortDirection, setSortDirection] = useState<TableSortDirection>();
    const [sortBy, setSortBy] = useState<UserFillSortBy>();

    const handleViewOrderDetails = (time: string, coin: string) => {
        if (onViewOrderDetails) {
            onViewOrderDetails(time, coin);
        }
    };

    const handleViewAll = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`/tradeHistory/${currentUserRef.current}`);
    };

    const handleExportCsv = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onExportCsv) {
            onExportCsv();
        }
    };

    const handleSort = (key: string) => {
        if (sortBy === key) {
            if (sortDirection === 'desc') {
                setSortDirection('asc');
            } else if (sortDirection === 'asc') {
                setSortDirection(undefined);
                setSortBy(undefined);
            } else {
                setSortDirection('desc');
            }
        } else {
            setSortBy(key as UserFillSortBy);
            setSortDirection('desc');
        }
    };

    const filteredData = useMemo(() => {
        switch (selectedFilter) {
            case 'all':
                return data;
            case 'active':
                return data.filter((fill) => fill.coin === symbol);
            case 'long':
                return data.filter((fill) => fill.side === 'buy');
            case 'short':
                return data.filter((fill) => fill.side === 'sell');
        }

        return data;
    }, [data, selectedFilter]);

    const sortedData = useMemo(() => {
        return [...sortUserFills(filteredData, sortBy, sortDirection)];
    }, [filteredData, sortBy, sortDirection]);

    const tradesToShow = useMemo(() => {
        if (pageMode) {
            return sortedData.slice(
                page * rowsPerPage,
                (page + 1) * rowsPerPage,
            );
        }
        return sortedData.slice(0, tableModeLimit);
    }, [sortedData, pageMode, page, rowsPerPage]);

    useEffect(() => {
        if (isFetched) {
            if (tradesToShow.length === 0) {
                setTableState(TableState.EMPTY);
            } else {
                setTableState(TableState.FILLED);
            }
        } else {
            setTableState(TableState.LOADING);
        }
    }, [tradesToShow, isFetched]);

    return (
        <div className={styles.tableWrapper}>
            {tableState === TableState.LOADING ? (
                <SkeletonTable rows={7} colRatios={[2, 1, 1, 1, 1, 1, 1, 1]} />
            ) : (
                <>
                    <TradeHistoryTableHeader
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        sortClickHandler={handleSort}
                    />
                    <div className={styles.tableBody}>
                        {tableState === TableState.FILLED && (
                            <>
                                {tradesToShow.map((trade, index) => (
                                    <TradeHistoryTableRow
                                        key={`trade-${index}`}
                                        trade={trade}
                                        onViewOrderDetails={
                                            handleViewOrderDetails
                                        }
                                    />
                                ))}

                                {sortedData.length > 0 && (
                                    <div className={styles.actionsContainer}>
                                        {sortedData.length > tableModeLimit && (
                                            <a
                                                href='#'
                                                className={styles.viewAllLink}
                                                onClick={handleViewAll}
                                            >
                                                View All
                                            </a>
                                        )}
                                        <a
                                            href='#'
                                            className={styles.exportLink}
                                            onClick={handleExportCsv}
                                        >
                                            Export as CSV
                                        </a>
                                    </div>
                                )}

                                {pageMode && (
                                    <>
                                        <Pagination
                                            totalCount={data.length}
                                            onPageChange={setPage}
                                            rowsPerPage={rowsPerPage}
                                            onRowsPerPageChange={setRowsPerPage}
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {tradesToShow.length === 0 && (
                            <div
                                className={styles.rowContainer}
                                style={{
                                    justifyContent: 'center',
                                    padding: '2rem 0',
                                }}
                            >
                                No trade history
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
