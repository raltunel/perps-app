import { useEffect, useMemo, useState } from 'react';
import NoDataRow from '~/components/Skeletons/NoDataRow';
import SkeletonTable from '~/components/Skeletons/SkeletonTable/SkeletonTable';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { TableSortDirection } from '~/utils/CommonIFs';
import { TableState } from '~/utils/CommonIFs';
import type {
    OrderDataIF,
    OrderDataSortBy,
} from '~/utils/orderbook/OrderBookIFs';
import { sortOrderData } from '~/utils/orderbook/OrderBookUtils';
import styles from './OpenOrdersTable.module.css';
import OpenOrdersTableHeader from './OpenOrdersTableHeader';
import OpenOrdersTableRow from './OpenOrdersTableRow';
import { openOrdersData } from './data';
import { WsChannels } from '~/utils/Constants';
import GenericTable from '~/components/Tables/GenericTable/GenericTable';
import { useDebugStore } from '~/stores/DebugStore';
interface OpenOrdersTableProps {
    data: OrderDataIF[];
    onCancel?: (time: number, coin: string) => void;
    onViewAll?: () => void;
    selectedFilter: string;
    isFetched: boolean;
    pageMode?: boolean;
}

export default function OpenOrdersTable(props: OpenOrdersTableProps) {
    const { onCancel, selectedFilter, isFetched, pageMode, data } = props;

    const handleCancel = (time: number, coin: string) => {
        if (onCancel) {
            onCancel(time, coin);
        }
    };

    const { debugWallet } = useDebugStore();

    const { symbol } = useTradeDataStore();

    const filteredOrders = useMemo(() => {
        switch (selectedFilter) {
            case 'all':
                return data;
            case 'active':
                return data.filter((order) => order.coin === symbol);
            case 'long':
                return data.filter((order) => order.side === 'buy');
            case 'short':
                return data.filter((order) => order.side === 'sell');
        }

        return data;
    }, [data, selectedFilter, symbol]);

    const viewAllLink = useMemo(() => {
        return `/openOrders/${debugWallet.address}`;
    }, [debugWallet.address]);

    return (
        <>
            <GenericTable
                data={filteredOrders}
                renderHeader={(sortDirection, sortClickHandler, sortBy) => (
                    <OpenOrdersTableHeader
                        sortBy={sortBy as OrderDataSortBy}
                        sortDirection={sortDirection}
                        sortClickHandler={sortClickHandler}
                    />
                )}
                renderRow={(order, index) => (
                    <OpenOrdersTableRow
                        key={`order-${index}`}
                        order={order}
                        onCancel={handleCancel}
                    />
                )}
                sorterMethod={sortOrderData}
                pageMode={pageMode}
                isFetched={isFetched}
                viewAllLink={viewAllLink}
                skeletonRows={7}
                skeletonColRatios={[1, 2, 2, 1, 1, 2, 1, 1, 2, 3, 1]}
            />
        </>
    );
}
