import { useMemo, useRef } from 'react';
import GenericTable from '~/components/Tables/GenericTable/GenericTable';
import DepositsWithdrawalsTableHeader from './DepositsWithdrawalsTableHeader';
import DepositsWithdrawalsTableRow, {
    type TransactionData,
} from './DepositsWithdrawalsTableRow';
import type { DepositAndWithDrawalSortBy } from '~/utils/UserDataIFs';
import type { TableSortDirection } from '~/utils/CommonIFs';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useDebugStore } from '~/stores/DebugStore';

// 1) Sorter that takes and returns TransactionData[]
function sortTransactionData(
    data: TransactionData[],
    sortBy: DepositAndWithDrawalSortBy,
    sortDirection: TableSortDirection,
): TransactionData[] {
    const copy = [...data];
    if (!sortBy || !sortDirection) return copy;

    const getKey = (tx: TransactionData): string | number => {
        const d: any = tx.delta;
        switch (sortBy) {
            case 'time':
                return tx.time;
            case 'status':
                return 'Completed';
            case 'network':
                return d.token || '';
            case 'action':
                return d.type;
            case 'valueChange':
                return parseFloat(d.amount || d.usdc || '0');
            case 'fee':
                return parseFloat(d.nativeTokenFee || d.fee || '0');
            default:
                return '';
        }
    };

    copy.sort((a, b) => {
        const aKey = getKey(a),
            bKey = getKey(b);
        if (typeof aKey === 'number' && typeof bKey === 'number') {
            return sortDirection === 'asc' ? aKey - bKey : bKey - aKey;
        }
        return sortDirection === 'asc'
            ? String(aKey).localeCompare(String(bKey))
            : String(bKey).localeCompare(String(aKey));
    });

    return copy;
}

export default function DepositsWithdrawalsTable({
    pageMode,
}: {
    pageMode?: boolean;
}) {
    const isFetchedLocal = true;

    const transactions = useTradeDataStore(
        (s) => s.userNonFundingLedgerUpdates,
    );

    // initial descending sort by time
    const sortedTxs = useMemo(
        () => [...transactions].sort((a, b) => b.time - a.time),
        [transactions],
    );
    const { debugWallet } = useDebugStore();
    const currentUserRef = useRef<string>('');
    currentUserRef.current = debugWallet.address;

    const viewAllLink = '/depositsandwithdrawals';

    //   console.log(sortedTxs)

    return (
        <GenericTable<TransactionData, DepositAndWithDrawalSortBy>
            storageKey={`DepositsWithdrawalsTable${currentUserRef.current}`}
            data={sortedTxs}
            renderHeader={(dir, onSort, by) => (
                <DepositsWithdrawalsTableHeader
                    sortBy={by}
                    sortDirection={dir}
                    sortClickHandler={onSort}
                />
            )}
            renderRow={(tx, idx) => (
                <DepositsWithdrawalsTableRow
                    key={`tx-${idx}`}
                    transaction={tx}
                />
            )}
            sorterMethod={sortTransactionData}
            isFetched={isFetchedLocal}
            pageMode={pageMode}
            viewAllLink={viewAllLink}
            skeletonRows={7}
            slicedLimit={0}
            skeletonColRatios={[2, 1, 1, 1, 1, 1, 1, 1]}
            defaultSortBy='time'
            defaultSortDirection='desc'
        />
    );
}
