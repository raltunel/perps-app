import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import ExternalPage from '~/components/ExternalPage/ExternalPage';
import TradeHistoryTable from '~/components/Trade/TradeHistoryTable/TradeHistoryTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { WsChannels } from '~/utils/Constants';
import type { UserFillIF } from '~/utils/UserDataIFs';

function TradeHistory() {
    const { address } = useParams<{ address: string }>();

    const [isFetched, setIsFetched] = useState(false);

    const { debugWallet } = useDebugStore();

    const { userFills, fetchedChannels } = useTradeDataStore();

    const tradeHistoryFetched = useMemo(() => {
        return fetchedChannels.has(WsChannels.USER_FILLS);
    }, [fetchedChannels]);

    const [fetchedHistoryData, setFetchedHistoryData] = useState<UserFillIF[]>(
        [],
    );

    const { fetchUserFills } = useInfoApi();

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
            fetchUserFills(address, true).then((data) => {
                setFetchedHistoryData(data);
                setIsFetched(true);
            });
        } else if (tradeHistoryFetched) {
            setIsFetched(true);
        }
    }, [isCurrentUser, address, tradeHistoryFetched]);

    const tableData = useMemo(() => {
        if (isCurrentUser) {
            return userFills;
        } else {
            return fetchedHistoryData;
        }
    }, [isCurrentUser, userFills, fetchedHistoryData]);

    return (
        <ExternalPage title='Trade History'>
            <TradeHistoryTable
                data={tableData}
                isFetched={isFetched}
                pageMode={true}
            />
        </ExternalPage>
    );
}
export default TradeHistory;
