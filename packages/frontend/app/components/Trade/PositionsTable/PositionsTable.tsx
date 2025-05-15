import { useEffect, useMemo, useState } from 'react';
import GenericTable from '~/components/Tables/GenericTable/GenericTable';
import NoDataRow from '~/components/Skeletons/NoDataRow';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { WsChannels } from '~/utils/Constants';
import styles from './PositionsTable.module.css';
import PositionsTableHeader from './PositionsTableHeader';
import PositionsTableRow from './PositionsTableRow';
import { useDebugStore } from '~/stores/DebugStore';
import type { PositionIF, PositionDataSortBy } from '~/utils/UserDataIFs';
import { sortUserFills } from '~/processors/processUserFills';

interface PositionsTableProps {
    pageMode?: boolean;
    data: PositionIF[];
    isFetched: boolean;
    selectedFilter?: string;
}

export default function PositionsTable(props: PositionsTableProps) {
    const { pageMode, data, isFetched, selectedFilter } = props;
    const { coinPriceMap } = useTradeDataStore();
    const { positions, fetchedChannels } = useTradeDataStore();
    const limit = 10;

    const { debugWallet } = useDebugStore();

    const webDataFetched = useMemo(() => {
        return fetchedChannels.has(WsChannels.WEB_DATA2);
    }, [fetchedChannels]);

    const viewAllLink = useMemo(() => {
        return `/positions/${debugWallet.address}`;
    }, [debugWallet.address]);

    return (
        <>
            <GenericTable
                data={positions as PositionIF[]}
                renderHeader={(sortDirection, sortClickHandler, sortBy) => (
                    <>
                        <PositionsTableHeader
                            sortBy={sortBy as PositionDataSortBy}
                            sortDirection={sortDirection}
                            sortClickHandler={sortClickHandler}
                        />
                    </>
                )}
                renderRow={(position, index) => (
                    <PositionsTableRow
                        key={`position-${index}`}
                        position={position as unknown as PositionIF}
                    />
                )}
                sorterMethod={sortUserFills}
                isFetched={isFetched}
                pageMode={pageMode}
                viewAllLink={viewAllLink}
                skeletonRows={7}
                skeletonColRatios={[2, 1, 1, 1, 1, 1, 1, 1]}
            />
        </>
    );
}
