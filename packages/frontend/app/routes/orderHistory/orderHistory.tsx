import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import OrderHistoryTable from '~/components/Trade/OrderHistoryTable/OrderHistoryTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';
import WebDataConsumer from '../trade/webdataconsumer';
import styles from './orderHistory.module.css';
import { WsChannels } from '~/utils/Constants';

function OrderHistory() {
    const { address } = useParams<{ address: string }>();

    const [isFetched, setIsFetched] = useState(false);

    const { debugWallet } = useDebugStore();

    const { orderHistory, fetchedChannels } = useTradeDataStore();

    const orderHistoryFetched = useMemo(() => {
        return fetchedChannels.has(WsChannels.USER_HISTORICAL_ORDERS);
    }, [fetchedChannels]);

    const [fetchedHistoryData, setFetchedHistoryData] = useState<OrderDataIF[]>(
        [],
    );

    const { fetchOrderHistory } = useInfoApi();

    // TODO: live update is disabled for now, because websocket snapshots were sending limited data
    const isCurrentUser = useMemo(() => {
        return false;
        // if (address) {
        //     return (
        //         address.toLocaleLowerCase() ===
        //         debugWallet.address.toLocaleLowerCase()
        //     );
        // } else {
        //     return true;
        // }
    }, [address, debugWallet.address]);

    useEffect(() => {
        if (!isCurrentUser && address) {
            fetchOrderHistory(address).then((data) => {
                setFetchedHistoryData(data);
                setIsFetched(true);
            });
        } else if (orderHistoryFetched) {
            setIsFetched(true);
        }
    }, [isCurrentUser, address, orderHistoryFetched]);

    const tableData = useMemo(() => {
        if (isCurrentUser) {
            return orderHistory;
        } else {
            return fetchedHistoryData;
        }
    }, [isCurrentUser, orderHistory, fetchedHistoryData]);

    const isFullScreen = true;

    // Memoize the container class name
    const containerClassName = useMemo(() => {
        return `${styles.container} ${isFullScreen ? styles.fullScreen : ''}`;
    }, [isFullScreen]);

    return (
        <div className={containerClassName}>
            {isCurrentUser && <WebDataConsumer />}
            <header>Order History</header>

            <div className={styles.content}>
                <OrderHistoryTable
                    data={tableData}
                    isFetched={isFetched}
                    pageMode={true}
                />
            </div>
        </div>
    );
}
export default OrderHistory;
