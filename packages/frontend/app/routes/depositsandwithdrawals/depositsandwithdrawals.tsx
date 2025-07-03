import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import ExternalPage from '~/components/ExternalPage/ExternalPage';
import DepositsWithdrawalsTable from '~/components/Trade/DepositsWithdrawalsTable/DepositsWithdrawalsTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { WsChannels } from '~/utils/Constants';
import type { TransactionData } from '~/components/Trade/DepositsWithdrawalsTable/DepositsWithdrawalsTableRow';
import WebDataConsumer from '../trade/webdataconsumer';

export default function DepositsAndWithdrawals() {
    const { address } = useParams<{ address: string }>();
    const [httpFetched, setHttpFetched] = useState(false);

    const debugWallet = useDebugStore((s) => s.debugWallet);
    const userNonFundingLedgerUpdates = useTradeDataStore(
        (s) => s.userNonFundingLedgerUpdates,
    );
    const fetchedChannels = useTradeDataStore((s) => s.fetchedChannels);
    const setTxs = useTradeDataStore((s) => s.setUserNonFundingLedgerUpdates);
    const { fetchUserNonFundingLedgerUpdates } = useInfoApi();

    const isCurrentUser = useMemo(
        () =>
            !!debugWallet?.address &&
            (!address ||
                address.toLowerCase() === debugWallet.address.toLowerCase()),
        [address, debugWallet],
    );
    const wsFetched = fetchedChannels.has(
        WsChannels.USER_NON_FUNDING_LEDGER_UPDATES,
    );

    useEffect(() => {
        if (!isCurrentUser && address) {
            setHttpFetched(false);
            fetchUserNonFundingLedgerUpdates(address)
                .then((txs) => setTxs(txs))
                .catch(console.error)
                .finally(() => setHttpFetched(true));
        }
    }, [isCurrentUser, address, fetchUserNonFundingLedgerUpdates, setTxs]);

    const isFetched = isCurrentUser ? wsFetched : httpFetched;

    const tableData = userNonFundingLedgerUpdates;

    return (
        <ExternalPage title='Deposits & Withdrawals'>
            <WebDataConsumer />
            <DepositsWithdrawalsTable
                pageMode
                isFetched={isFetched}
                data={tableData}
            />
        </ExternalPage>
    );
}
