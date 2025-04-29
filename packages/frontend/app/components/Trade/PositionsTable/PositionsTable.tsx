import PositionsTableHeader from './PositionsTableHeader';
import PositionsTableRow from './PositionsTableRow';
import styles from './PositionsTable.module.css';
import { positionsData } from './data';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useNavigate } from 'react-router';
import { useDebugStore } from '~/stores/DebugStore';
import { useCallback, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaChevronUp } from 'react-icons/fa';

interface PositionsTableProps {
    pageMode?: boolean;
}

const rowsOptions = [10, 20, 50, 100];

export default function PositionsTable(props: PositionsTableProps) {
    const { pageMode } = props;
    const navigate = useNavigate();

    const { debugWallet } = useDebugStore();

    const handleViewAll = () => {
        navigate(`/positions/${debugWallet.address}`);
    };

    const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const { positions } = useTradeDataStore();
    const limit = 10;

    const rowsItems = useCallback(() => {
        return rowsOptions.map((value) => (
            <div
                key={value}
                className={styles.dropdownItem}
                onClick={() => setRowsPerPage(value)}
            >
                {value}
            </div>
        ));
    }, []);

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
                        <div className={styles.paginationContainer}>
                            <div className={styles.rowsPerPage}>
                                Rows per page:
                                <div
                                    className={styles.rowSelector}
                                    onClick={() =>
                                        setIsRowsDropdownOpen(
                                            !isRowsDropdownOpen,
                                        )
                                    }
                                >
                                    {rowsPerPage}
                                    <FaChevronUp className={styles.chvrUp} />
                                    {isRowsDropdownOpen && (
                                        <div
                                            className={` ${styles.dropupMenu}`}
                                        >
                                            {rowsItems()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.pageInfo}>
                                {page * rowsPerPage + 1}-
                                {(page + 1) * rowsPerPage} of {positions.length}
                            </div>

                            <div className={styles.pageButtons}>
                                <button
                                    className={styles.pageButton}
                                    onClick={() => {
                                        if (page > 0) {
                                            setPage(page - 1);
                                        }
                                    }}
                                    disabled={page === 0}
                                >
                                    <FaChevronLeft size={20} />
                                </button>

                                <button
                                    className={styles.pageButton}
                                    onClick={() => {
                                        if (
                                            page <
                                            positions.length / rowsPerPage - 1
                                        ) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    disabled={
                                        page ===
                                        positions.length / rowsPerPage - 1
                                    }
                                >
                                    <FaChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
