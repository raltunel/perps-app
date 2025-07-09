import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ExternalPage from '~/components/ExternalPage/ExternalPage';
import DepositsWithdrawalsTable from '~/components/Trade/DepositsWithdrawalsTable/DepositsWithdrawalsTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { TransactionData } from '~/components/Trade/DepositsWithdrawalsTable/DepositsWithdrawalsTableRow';

export default function DepositsAndWithdrawals() {
    const { address } = useParams<{ address?: string }>();
    const walletAddress = useDebugStore((s) => s.debugWallet.address);
    const targetAddress = address ?? walletAddress;

    const { fetchUserNonFundingLedgerUpdates } = useInfoApi();
    const transactions = useTradeDataStore(
        (s) => s.userNonFundingLedgerUpdates,
    );
    const setTransactions = useTradeDataStore(
        (s) => s.setUserNonFundingLedgerUpdates,
    );

    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        if (!targetAddress) return;
        setIsFetched(true);

        fetchUserNonFundingLedgerUpdates(targetAddress)
            .then((txs: TransactionData[]) => setTransactions(txs))
            .catch(console.error)
            .finally(() => setIsFetched(false));
    }, [targetAddress]);

    return (
        <ExternalPage title='Deposits & Withdrawals'>
            <DepositsWithdrawalsTable
                data={transactions}
                isFetched={!isFetched}
                pageMode
            />
        </ExternalPage>
    );
}
