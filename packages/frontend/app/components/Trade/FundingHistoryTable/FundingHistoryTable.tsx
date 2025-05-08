import React from 'react';
import styles from './FundingHistoryTable.module.css';
import FundingHistoryTableHeader from './FundingHistoryTableHeader';
import FundingHistoryTableRow from './FundingHistoryTableRow';
import { fundingHistoryData } from './data';

interface FundingHistoryTableProps {
    onViewAll?: () => void;
    onExportCsv?: () => void;
}

export default function FundingHistoryTable(props: FundingHistoryTableProps) {
    const { onViewAll, onExportCsv } = props;

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
            <FundingHistoryTableHeader />
            <div className={styles.tableBody}>
                {fundingHistoryData.map((history, index) => (
                    <FundingHistoryTableRow
                        key={`funding-history-${index}`}
                        fundingHistory={history}
                    />
                ))}

                {fundingHistoryData.length === 0 && (
                    <div
                        className={styles.rowContainer}
                        style={{ justifyContent: 'center', padding: '2rem 0' }}
                    >
                        No funding history
                    </div>
                )}

                {fundingHistoryData.length > 0 && (
                    <div className={styles.linksContainer}>
                        <a
                            href='#'
                            className={styles.viewAllLink}
                            onClick={handleViewAll}
                        >
                            View All
                        </a>
                        <a
                            href='#'
                            className={styles.exportCsvLink}
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
