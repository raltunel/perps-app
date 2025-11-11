import type { PayoutByReferrerT } from '~/routes/referrals/referrals';
import styles from './ReferralsTable.module.css';
import truncString from '~/utils/functions/truncString';
import useNumFormatter from '~/hooks/useNumFormatter';

interface ReferralsTableRowProps {
    referral: PayoutByReferrerT;
}

export default function ReferralsTableRow({
    referral,
}: ReferralsTableRowProps) {
    const { formatNum } = useNumFormatter();

    const [address, data] = Object.entries(referral)[0];

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell} ${styles.addressCell}`}>
                {truncString(address, 5, 5)}
            </div>
            <div className={`${styles.cell} ${styles.dateJoinedCell}`}>
                {/* {referral.dateJoined} */}
            </div>
            <div className={`${styles.cell} ${styles.volumeCell}`}>
                {formatNum(data.volume, 2, true, true)}
            </div>
            <div className={`${styles.cell} ${styles.feesCell}`}>
                {formatNum(0, 2, true, true)}
            </div>
            <div className={`${styles.cell} ${styles.rewardsCell}`}>
                {formatNum(data.earnings[0].amount, 2, true, true)}
            </div>
        </div>
    );
}
