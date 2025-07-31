import { useRef } from 'react';
import GenericTable from '~/components/Tables/GenericTable/GenericTable';
import { sortUserBalances } from '~/processors/processUserBalance';
import { useDebugStore } from '~/stores/DebugStore';
import { useUnifiedMarginData } from '~/hooks/useUnifiedMarginData';
import BalancesTableHeader from './BalancesTableHeader';
import BalancesTableRow from './BalancesTableRow';

export default function BalancesTable() {
    const { debugWallet } = useDebugStore();
    const currentUserRef = useRef<string>('');
    currentUserRef.current = debugWallet.address;

    // Use unified margin data
    const { balance, isLoading, error } = useUnifiedMarginData();

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
