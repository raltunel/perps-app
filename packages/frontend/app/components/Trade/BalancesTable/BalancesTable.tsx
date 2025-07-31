import { useRef } from 'react';
import GenericTable from '~/components/Tables/GenericTable/GenericTable';
import { sortUserBalances } from '~/processors/processUserBalance';
import { useDebugStore } from '~/stores/DebugStore';
import { useMarginBucketStore } from '~/stores/MarginBucketStore';
import BalancesTableHeader from './BalancesTableHeader';
import BalancesTableRow from './BalancesTableRow';

export default function BalancesTable() {
    const { debugWallet } = useDebugStore();
    const currentUserRef = useRef<string>('');
    currentUserRef.current = debugWallet.address;

    // Use global store data instead of local polling
    const { balance, isLoading, error } = useMarginBucketStore();

    // Create array with single balance or empty array
    const balanceData = balance ? [balance] : [];

    return (
        <GenericTable
            storageKey={`BalancesTable_${currentUserRef.current}`}
            data={balanceData}
            renderHeader={(sortDirection, sortClickHandler, sortBy) => (
                <BalancesTableHeader
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    sortClickHandler={sortClickHandler}
                />
            )}
            renderRow={(balance, index) => (
                <BalancesTableRow key={`balance-${index}`} balance={balance} />
            )}
            sorterMethod={sortUserBalances}
            isFetched={!isLoading}
            pageMode={false}
            viewAllLink={''}
            skeletonRows={1}
            skeletonColRatios={[1, 2, 2, 1, 1, 1, 3]}
            defaultSortBy={'usdcValue'}
            defaultSortDirection={'desc'}
        />
    );
}
