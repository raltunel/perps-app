import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ExternalPage from '~/components/ExternalPage/ExternalPage';
import TradeHistoryTable from '~/components/Trade/TradeHistoryTable/TradeHistoryTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { UserFillIF } from '~/utils/UserDataIFs';

export default function TradeHistory() {
    const { address } = useParams<{ address?: string }>();
    const walletAddress = useDebugStore((s) => s.debugWallet.address);
    const targetAddress = address ?? walletAddress;

    const userFills = useTradeDataStore((s) => s.userFills);
    const setUserFills = useTradeDataStore((s) => s.setUserFills);

    const { fetchUserFills } = useInfoApi();

    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        if (!targetAddress) return;
        setIsFetched(true);
        fetchUserFills(targetAddress)
            .then((fills: UserFillIF[]) => {
                setUserFills(fills);
            })
            .catch(console.error)
            .finally(() => setIsFetched(false));
    }, [targetAddress]);

    return (
        <ExternalPage title='Trade History'>
            <TradeHistoryTable
                data={userFills}
                isFetched={!isFetched}
                pageMode
            />
        </ExternalPage>
    );
}
