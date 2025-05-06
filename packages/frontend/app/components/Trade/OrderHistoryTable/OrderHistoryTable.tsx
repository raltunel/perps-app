import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { ApiEndpoints, useInfoApi } from '~/hooks/useInfoApi';
import { useSdk } from '~/hooks/useSdk';
import { processUserOrder } from '~/processors/processOrderBook';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { OrderHistoryLimits, WsChannels } from '~/utils/Constants';
import type {
    OrderDataIF,
    OrderDataSortBy,
} from '~/utils/orderbook/OrderBookIFs';
import styles from './OrderHistoryTable.module.css';
import OrderHistoryTableHeader from './OrderHistoryTableHeader';
import OrderHistoryTableRow from './OrderHistoryTableRow';
import { orderHistoryData } from './data';
import { TableState, type TableSortDirection } from '~/utils/CommonIFs';
import SkeletonTable from '~/components/Skeletons/SkeletonTable/SkeletonTable';
import NoDataRow from '~/components/Skeletons/NoDataRow';
import { sortOrderData } from '~/utils/orderbook/OrderBookUtils';

interface OrderHistoryTableProps {
    onViewAll?: () => void;
    selectedFilter: string;
    pageMode?: boolean;
    data: OrderDataIF[];
    isFetched: boolean;
}

export default function OrderHistoryTable(props: OrderHistoryTableProps) {
    const { onViewAll, selectedFilter, pageMode, data, isFetched } = props;

    const [sortDirection, setSortDirection] = useState<TableSortDirection>();
    const [sortBy, setSortBy] = useState<OrderDataSortBy>();

    const { info } = useSdk();
    const { symbol, filterOrderHistory } = useTradeDataStore();

    const { debugWallet } = useDebugStore();

    const currentUserRef = useRef<string>('');
    currentUserRef.current = debugWallet.address;

    const { isWsEnabled } = useDebugStore();
    const isWsEnabledRef = useRef<boolean>(true);
    isWsEnabledRef.current = isWsEnabled;

    const [tableState, setTableState] = useState<TableState>(
        TableState.LOADING,
    );
    useEffect(() => {
        if (isFetched) {
            if (data.length > 0) {
                setTableState(TableState.FILLED);
            } else {
                setTableState(TableState.EMPTY);
            }
        } else {
            setTableState(TableState.LOADING);
        }
    }, [data, isFetched]);

    const filteredOrderHistory = useMemo(() => {
        return filterOrderHistory(data, selectedFilter);
    }, [data, selectedFilter, symbol]);

    const sortedOrderHistory = useMemo(() => {
        return sortOrderData(filteredOrderHistory, sortBy, sortDirection);
    }, [filteredOrderHistory, sortBy, sortDirection]);

    const orderHistoryToShow = useMemo(() => {
        if (pageMode) {
            return sortedOrderHistory.slice(0, 50);
        }
        // TODO page logic will be implemented for external page
        return sortedOrderHistory.slice(0, 10);
    }, [sortedOrderHistory, pageMode]);

    useEffect(() => {
        if (!info) return;
        if (!debugWallet.address) return;
    }, [debugWallet.address, info]);

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
            setSortBy(key as OrderDataSortBy);
            setSortDirection('desc');
        }
    };

    const handleViewAll = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onViewAll) {
            onViewAll();
        }
    };

    return (
        <div className={styles.tableWrapper}>
            {tableState === TableState.LOADING ? (
                <SkeletonTable
                    rows={7}
                    colRatios={[1, 2, 2, 1, 1, 2, 1, 1, 2, 3, 1]}
                />
            ) : (
                <>
                    <OrderHistoryTableHeader
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        sortClickHandler={handleSort}
                    />
                    <div className={styles.tableBody}>
                        {tableState === TableState.FILLED && (
                            <>
                                {orderHistoryToShow.map((order, index) => (
                                    <OrderHistoryTableRow
                                        key={`order-${index}`}
                                        order={order}
                                    />
                                ))}
                                <a
                                    href='#'
                                    className={styles.viewAllLink}
                                    onClick={handleViewAll}
                                >
                                    View All
                                </a>
                            </>
                        )}

                        {tableState === TableState.EMPTY && <NoDataRow />}
                    </div>
                </>
            )}
        </div>
    );
}
