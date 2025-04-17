import React, { useMemo, useState } from 'react';
import OpenOrdersTableHeader from './OpenOrdersTableHeader';
import OpenOrdersTableRow, { type OpenOrderData } from './OpenOrdersTableRow';
import styles from './OpenOrdersTable.module.css';
import { openOrdersData } from './data';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { OrderDataSortBy } from '~/utils/orderbook/OrderBookIFs';
import type { TableSortDirection } from '~/utils/CommonIFs';
import { sortOrderData } from '~/utils/orderbook/OrderBookUtils';
interface OpenOrdersTableProps {
    onCancel?: (time: number, coin: string) => void;
    onViewAll?: () => void;
    selectedFilter: string;
}

export default function OpenOrdersTable(props: OpenOrdersTableProps) {
    const { onCancel, onViewAll, selectedFilter } = props;

    const [sortDirection, setSortDirection] = useState<TableSortDirection>();
    const [sortBy, setSortBy] = useState<OrderDataSortBy>();

    const handleCancel = (time: number, coin: string) => {
        if (onCancel) {
            onCancel(time, coin);
        }
    };

    const handleViewAll = () => {
        if (onViewAll) {
            onViewAll();
        }
    };

    const { userSymbolOrders, userOrders } = useTradeDataStore();

    const openOrdersLimit = 50;

    const filteredOrders = useMemo(() => {
        switch (selectedFilter) {
            case 'all':
                return userOrders;
            case 'active':
                return userSymbolOrders;
            case 'long':
                return userOrders.filter((order) => order.side === 'buy');
            case 'short':
                return userOrders.filter((order) => order.side === 'sell');
        }

        return userOrders;
    }, [userOrders, selectedFilter]);

    const sortedOrders = useMemo(() => {
        return sortOrderData(filteredOrders, sortBy, sortDirection);
    }, [filteredOrders, sortBy, sortDirection]);

    const slicedOrders = useMemo(() => {
        return sortedOrders.slice(0, openOrdersLimit);
    }, [sortedOrders]);

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

    return (
        <div className={styles.tableWrapper}>
            <OpenOrdersTableHeader
                sortBy={sortBy}
                sortDirection={sortDirection}
                sortClickHandler={handleSort}
            />
            <div className={styles.tableBody}>
                {slicedOrders.map((order, index) => (
                    <OpenOrdersTableRow
                        key={`order-${order.oid}`}
                        order={order}
                        onCancel={handleCancel}
                    />
                ))}

                {openOrdersData.length === 0 && (
                    <div
                        className={styles.rowContainer}
                        style={{ justifyContent: 'center', padding: '2rem 0' }}
                    >
                        No open orders
                    </div>
                )}

                {openOrdersData.length > 0 && (
                    <a
                        href='#'
                        className={styles.viewAllLink}
                        onClick={(e) => {
                            e.preventDefault();
                            handleViewAll();
                        }}
                    >
                        View All
                    </a>
                )}
            </div>
        </div>
    );
}
