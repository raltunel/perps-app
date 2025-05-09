import FillTwapTableHeader from './FillTwapTableHeader';
import FillTwapTableRow from './FillTwapTableRow';
import styles from './FillTwapTable.module.css';
import { fillData } from './data';
import type { TwapSliceFillIF } from '~/utils/UserDataIFs';

interface FillTwapTableProps {
    data: TwapSliceFillIF[];
    isFetched: boolean;
    selectedFilter?: string;
}

export default function FillTwapTable(props: FillTwapTableProps) {
    const { data, isFetched, selectedFilter } = props;

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
