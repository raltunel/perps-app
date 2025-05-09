import PositionsTableHeader from './PositionsTableHeader';
import PositionsTableRow from './PositionsTableRow';
import styles from './PositionsTable.module.css';
import { positionsData } from './data';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useMemo, useState } from 'react';
import type { TableSortDirection } from '~/utils/CommonIFs';
import type { PositionDataSortBy } from '~/utils/position/PositionIFs';
import { sortPositionData } from '~/utils/position/positionUtils';



export default function PositionsTable() {
    const { positions } = useTradeDataStore();
    const limit = 10;
    const [sortDirection, setSortDirection] = useState<TableSortDirection>();
    const [sortBy, setSortBy] = useState<PositionDataSortBy>();

     const sortedPositions = useMemo(() => {
            return sortPositionData(positions, sortBy, sortDirection);
        }, [positions, sortBy, sortDirection]);

            const handleSort = (key: string) => {
                if (sortBy === key) {
                    if (sortDirection === 'desc') {
                        setSortDirection('asc');
                    } else if (sortDirection === 'asc') {
                        setSortDirection(undefined);
                        setSortBy(undefined);
                    } else {
                        setSortDirection('desc');
                    }
                } else {
                    setSortBy(key as PositionDataSortBy);
                    setSortDirection('desc');
                }
            };

    return (
        <div className={styles.tableWrapper}>
            <PositionsTableHeader 
                sortBy={sortBy}
                sortDirection={sortDirection}
                sortClickHandler={handleSort} />
            <div className={styles.tableBody}>
                {sortedPositions.map((position, index) => (
                    <PositionsTableRow
                        key={`position-${index}`}
                        position={position}
                    />
                ))}

                {positions.length === 0 && (
                    <div
                        className={styles.rowContainer}
                        style={{ justifyContent: 'center', padding: '2rem 0' }}
                    >
                        No open positions
                    </div>
                )}
            </div>
        </div>
    );
}
