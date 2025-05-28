import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ExternalPage from '~/components/ExternalPage/ExternalPage';
import OpenOrdersTable from '~/components/Trade/OpenOrdersTable/OpenOrdersTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';

function OpenOrders() {
    const { address } = useParams<{ address: string }>();

    const [isFetched, setIsFetched] = useState(false);

    const [fetchedData, setFetchedData] = useState<OrderDataIF[]>([]);

    const { fetchOpenOrders } = useInfoApi();

    useEffect(() => {
        if (address) {
            fetchOpenOrders(address).then((data) => {
                setFetchedData(data);
                setIsFetched(true);
            });
        }
    }, [address]);

    return (
        <ExternalPage title='Open Orders'>
            <OpenOrdersTable
                data={fetchedData}
                isFetched={isFetched}
                pageMode={true}
            />
        </ExternalPage>
    );
}
export default OpenOrders;
