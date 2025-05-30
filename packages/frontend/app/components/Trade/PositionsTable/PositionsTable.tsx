import { useMemo } from 'react';
import GenericTable from '~/components/Tables/GenericTable/GenericTable';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { WsChannels } from '~/utils/Constants';
import PositionsTableHeader from './PositionsTableHeader';
import PositionsTableRow from './PositionsTableRow';
import { useDebugStore } from '~/stores/DebugStore';
import type { PositionIF, PositionDataSortBy } from '~/utils/UserDataIFs';
import { sortPositionData } from '~/utils/position/PositionUtils';
import type { TableSortDirection } from '~/utils/CommonIFs';
import { useModal, type useModalIF } from '~/hooks/useModal';

interface PositionsTableProps {
    pageMode?: boolean;
    isFetched: boolean;
    selectedFilter?: string;
}

export default function PositionsTable(props: PositionsTableProps) {
    const { pageMode, isFetched, selectedFilter } = props;
    const { coinPriceMap } = useTradeDataStore();
    const { positions, fetchedChannels } = useTradeDataStore();
    const appSettingsModal: useModalIF = useModal('closed');

    const { debugWallet } = useDebugStore();

    const webDataFetched = useMemo(() => {
        return fetchedChannels.has(WsChannels.WEB_DATA2);
    }, [fetchedChannels]);

    const viewAllLink = '/positions';

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
                        openTPModal={appSettingsModal.open}
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
