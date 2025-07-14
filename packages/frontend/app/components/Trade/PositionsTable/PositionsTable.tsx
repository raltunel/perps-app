import { useMemo, useRef } from 'react';
import GenericTable from '~/components/Tables/GenericTable/GenericTable';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { EXTERNAL_PAGE_URL_PREFIX, WsChannels } from '~/utils/Constants';
import PositionsTableHeader from './PositionsTableHeader';
import PositionsTableRow from './PositionsTableRow';
import { useDebugStore } from '~/stores/DebugStore';
import type { PositionIF, PositionDataSortBy } from '~/utils/UserDataIFs';
import { sortPositionData } from '~/utils/position/PositionUtils';
import type { TableSortDirection } from '~/utils/CommonIFs';
import { useModal } from '~/hooks/useModal';

interface PositionsTableProps {
    pageMode?: boolean;
    isFetched: boolean;
    selectedFilter?: string;
}

export default function PositionsTable(props: PositionsTableProps) {
    const { pageMode, isFetched, selectedFilter } = props;
    const { coinPriceMap } = useTradeDataStore();
    const { positions, fetchedChannels } = useTradeDataStore();
    const appSettingsModal = useModal('closed');

    const { debugWallet } = useDebugStore();

    const currentUserRef = useRef<string>('');
    currentUserRef.current = debugWallet.address;

    const webDataFetched = useMemo(() => {
        return fetchedChannels.has(WsChannels.WEB_DATA2);
    }, [fetchedChannels]);

    const viewAllLink = `${EXTERNAL_PAGE_URL_PREFIX}/positions`;

    const { symbol } = useTradeDataStore();

    const filteredData = useMemo(() => {
        switch (selectedFilter) {
            case 'all':
                return positions;
            case 'active':
                return positions.filter((fill) => fill.coin === symbol);
            case 'long':
                return positions.filter((fill) => fill.szi > 0);
            case 'short':
                return positions.filter((fill) => fill.szi < 0);
        }

        return positions;
    }, [positions, selectedFilter]);
    return (
        <>
            <GenericTable
                storageKey={`PositionsTable_${currentUserRef.current}`}
                data={filteredData as any}
                renderHeader={(sortDirection, sortClickHandler, sortBy) => (
                    <>
                        <PositionsTableHeader
                            sortBy={sortBy as PositionDataSortBy}
                            sortDirection={sortDirection}
                            sortClickHandler={sortClickHandler as any}
                        />
                    </>
                )}
                renderRow={(position, index) => (
                    <PositionsTableRow
                        key={`position-${index}`}
                        position={position as unknown as PositionIF}
                        openTPModal={() => appSettingsModal.open()}
                        closeTPModal={appSettingsModal.close}
                    />
                )}
                sorterMethod={(
                    positions: PositionIF[],
                    sortBy: PositionDataSortBy,
                    sortDirection: TableSortDirection,
                    _ignoredMap?: Record<string, number>,
                ) =>
                    sortPositionData(
                        positions,
                        sortBy,
                        sortDirection,
                        coinPriceMap,
                    )
                }
                isFetched={isFetched}
                pageMode={pageMode}
                viewAllLink={viewAllLink}
                skeletonRows={7}
                skeletonColRatios={[2, 1, 1, 1, 1, 1, 1, 1]}
            />
        </>
    );
}
