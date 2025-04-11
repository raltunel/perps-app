import FillTwapTableHeader from './FillTwapTableHeader';
import FillTwapTableRow from './FillTwapTableRow';
import styles from './FillTwapTable.module.css';
import { fillData } from './data';

export default function FillTwapTable() {
    return (
        <div className={styles.tableWrapper}>
            <FillTwapTableHeader />
            <div className={styles.tableBody}>
                {fillData.length > 0 ? (
                    fillData.map((fill, index) => (
                        <FillTwapTableRow key={`fill-${index}`} fill={fill} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        No fill history available
                    </div>
                )}
            </div>
        </div>
    );
}
