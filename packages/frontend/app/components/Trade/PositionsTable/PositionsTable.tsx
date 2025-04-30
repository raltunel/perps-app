import PositionsTableHeader from './PositionsTableHeader';
import PositionsTableRow from './PositionsTableRow';
import styles from './PositionsTable.module.css';
import { positionsData } from './data';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useNavigate } from 'react-router';
import { useDebugStore } from '~/stores/DebugStore';
import { useCallback, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaChevronUp } from 'react-icons/fa';
import Pagination from '~/components/Pagination/Pagination';

interface PositionsTableProps {
    pageMode?: boolean;
}

export default function PositionsTable(props: PositionsTableProps) {
    const { pageMode } = props;
    const navigate = useNavigate();

    const handleViewAll = () => {
        navigate(`/positions`);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const { positions } = useTradeDataStore();
    const limit = 10;

    const positionsToShow = useMemo(() => {
        if (pageMode) {
            return positions.slice(
                page * rowsPerPage,
                (page + 1) * rowsPerPage,
            );
        }
        return positions.slice(0, limit);
    }, [positions, page, rowsPerPage, pageMode]);

    return (
        <div className={styles.tableWrapper}>
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
                        style={{ justifyContent: 'center', padding: '2rem 0' }}
                    >
                        No open positions
                    </div>
                )}

                {positions.length > 0 && !pageMode && (
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
        </div>
    );
}
