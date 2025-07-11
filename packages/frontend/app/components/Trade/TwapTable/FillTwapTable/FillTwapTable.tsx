import { useMemo, useRef } from 'react';
import GenericTable from '~/components/Tables/GenericTable/GenericTable';
import { sortTwapFillHistory } from '~/processors/processUserFills';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { TwapSliceFillIF, UserFillSortBy } from '~/utils/UserDataIFs';
import FillTwapTableHeader from './FillTwapTableHeader';
import FillTwapTableRow from './FillTwapTableRow';

interface FillTwapTableProps {
    data: TwapSliceFillIF[];
    isFetched: boolean;
    selectedFilter?: string;
    pageMode?: boolean;
}

export default function FillTwapTable(props: FillTwapTableProps) {
    const { data, isFetched, selectedFilter, pageMode } = props;

    const { symbol } = useTradeDataStore();

    const { debugWallet } = useDebugStore();

    const currentUserRef = useRef<string>('');
    currentUserRef.current = debugWallet.address;

    const viewAllLink = useMemo(() => {
        return `/twapFillHistory/${currentUserRef.current}`;
    }, [debugWallet.address]);

    const filteredData = useMemo(() => {
        switch (selectedFilter) {
            case 'all':
                return data;
            case 'active':
                return data.filter((twap) => twap.coin === symbol);
            case 'long':
                return data.filter((twap) => twap.side === 'buy');
            case 'short':
                return data.filter((twap) => twap.side === 'sell');
        }
        return data;
    }, [data, selectedFilter, symbol]);

    return (
        <>
            <GenericTable
                storageKey={`FillTwapTable_${currentUserRef.current}`}
                data={filteredData as any}
                renderHeader={(sortDirection, sortClickHandler, sortBy) => (
                    <FillTwapTableHeader
                        sortBy={sortBy as UserFillSortBy}
                        sortDirection={sortDirection}
                        sortClickHandler={sortClickHandler}
                    />
                )}
                renderRow={(fill, index) => (
                    <FillTwapTableRow
                        key={`fill-${index}`}
                        fill={fill as any}
                    />
                )}
                sorterMethod={sortTwapFillHistory}
                isFetched={isFetched}
                pageMode={pageMode}
                viewAllLink={viewAllLink}
                skeletonRows={7}
                skeletonColRatios={[2, 1, 1, 1, 1, 1, 1, 1]}
                defaultSortBy={'time'}
                defaultSortDirection={'desc'}
                heightOverride={`${pageMode ? '100%' : '90%'}`}
            />
        </>
    );
}
