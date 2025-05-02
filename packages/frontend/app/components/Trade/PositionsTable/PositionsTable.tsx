import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Pagination from '~/components/Pagination/Pagination';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './PositionsTable.module.css';
import PositionsTableHeader from './PositionsTableHeader';
import PositionsTableRow from './PositionsTableRow';
import { useDebugStore } from '~/stores/DebugStore';
import SkeletonTable from '~/components/Skeletons/SkeletonTable/SkeletonTable';

interface PositionsTableProps {
    pageMode?: boolean;
}

export enum TableState {
    LOADING = 'loading',
    EMPTY = 'empty',
    FILLED = 'filled',
}

export default function PositionsTable(props: PositionsTableProps) {
    const { pageMode } = props;
    const navigate = useNavigate();

    const handleViewAll = () => {
        navigate(`/positions`);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [tableState, setTableState] = useState<TableState>(
        TableState.LOADING,
    );

    const { positions, webDataFetched } = useTradeDataStore();
    const limit = 10;

    const { debugWallet } = useDebugStore();

    const positionsToShow = useMemo(() => {
        if (pageMode) {
            return positions.slice(
                page * rowsPerPage,
                (page + 1) * rowsPerPage,
            );
        }
        return positions.slice(0, limit);
    }, [positions, page, rowsPerPage, pageMode]);

    useEffect(() => {
        setTableState(TableState.LOADING);
    }, [debugWallet.address]);

    useEffect(() => {
        if (webDataFetched) {
            if (positionsToShow.length > 0) {
                setTableState(TableState.FILLED);
            } else {
                setTableState(TableState.EMPTY);
            }
        }
    }, [positionsToShow, webDataFetched]);

    return (
        <div className={styles.tableWrapper}>
            {/* <SkeletonTable
                rows={7}
                colRatios={[1, 2, 2, 1, 1, 3, 1, 1, 2, 3, 1]}
            /> */}
            {tableState === TableState.LOADING && (
                <SkeletonTable
                    rows={7}
                    colRatios={[1, 2, 2, 1, 1, 2, 1, 1, 2, 3, 1]}
                />
            )}

            {tableState === TableState.FILLED && (
                <>
                    <PositionsTableHeader />
                    <div className={styles.tableBody}>
                        {positionsToShow.map((position, index) => (
                            <PositionsTableRow
                                key={`position-${index}`}
                                position={position}
                            />
                        ))}

                        {positions.length === 0 && (
                            <div
                                className={styles.rowContainer}
                                style={{
                                    justifyContent: 'center',
                                    padding: '2rem 0',
                                }}
                            >
                                No open positions
                            </div>
                        )}

                        {positions.length > limit && !pageMode && (
                            <a
                                href='#'
                                className={styles.viewAllLink}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleViewAll();
                                }}
                            >
                                View All
                            </a>
                        )}

                        {pageMode && (
                            <>
                                <Pagination
                                    totalCount={positions.length}
                                    onPageChange={setPage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={setRowsPerPage}
                                />
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
