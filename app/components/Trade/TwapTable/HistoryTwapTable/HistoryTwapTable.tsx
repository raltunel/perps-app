import HistoryTwapTableHeader from './HistoryTwapTableHeader';
import HistoryTwapTableRow from './HistoryTwapTableRow';
import styles from './HistoryTwapTable.module.css';
import { historyTwapsData } from './data';

export default function HistoryTwapTable() {
    const handleViewAll = () => {
        console.log('View all TWAPs');
    };

    return (
        <div className={styles.tableWrapper}>
            <HistoryTwapTableHeader />
            <div className={styles.tableBody}>
                {historyTwapsData.length > 0 ? (
                    historyTwapsData.map((twap, index) => (
                        <HistoryTwapTableRow
                            key={`twap-${index}`}
                            twap={twap}
                        />
                    ))
                ) : (
                    <div className={styles.emptyState}>No TWAPs yet</div>
                )}
            </div>

            {historyTwapsData.length > 0 && (
                <div className={styles.viewAllLink} onClick={handleViewAll}>
                    View All
                </div>
            )}
        </div>
    );
}
