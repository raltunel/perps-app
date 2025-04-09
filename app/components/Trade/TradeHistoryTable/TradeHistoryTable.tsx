import React from 'react';
import TradeHistoryTableHeader from './TradeHistoryTableHeader';
import TradeHistoryTableRow, {
    type TradeHistoryData,
} from './TradeHistoryTableRow';
import styles from './TradeHistoryTable.module.css';
import { tradeHistoryData } from './data';

interface TradeHistoryTableProps {
    onViewOrderDetails?: (time: string, coin: string) => void;
    onViewAll?: () => void;
    onExportCsv?: () => void;
}

export default function TradeHistoryTable(props: TradeHistoryTableProps) {
    const { onViewOrderDetails, onViewAll, onExportCsv } = props;

    const handleViewOrderDetails = (time: string, coin: string) => {
        if (onViewOrderDetails) {
            onViewOrderDetails(time, coin);
        }
    };

    const handleViewAll = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onViewAll) {
            onViewAll();
        }
    };

    const handleExportCsv = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onExportCsv) {
            onExportCsv();
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <TradeHistoryTableHeader />
            <div className={styles.tableBody}>
                {tradeHistoryData.map((trade, index) => (
                    <TradeHistoryTableRow
                        key={`trade-${index}`}
                        trade={trade}
                        onViewOrderDetails={handleViewOrderDetails}
                    />
                ))}

                {tradeHistoryData.length === 0 && (
                    <div
                        className={styles.rowContainer}
                        style={{ justifyContent: 'center', padding: '2rem 0' }}
                    >
                        No trade history
                    </div>
                )}

                {tradeHistoryData.length > 0 && (
                    <div className={styles.actionsContainer}>
                        <a
                            href='#'
                            className={styles.viewAllLink}
                            onClick={handleViewAll}
                        >
                            View All
                        </a>
                        <a
                            href='#'
                            className={styles.exportLink}
                            onClick={handleExportCsv}
                        >
                            Export as CSV
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
