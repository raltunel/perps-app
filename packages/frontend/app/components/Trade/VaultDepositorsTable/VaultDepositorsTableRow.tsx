import useNumFormatter from '~/hooks/useNumFormatter';
import type { VaultFollowerStateIF } from '~/utils/VaultIFs';
import styles from './VaultDepositorsTable.module.css';

interface VaultDepositorsTableRowProps {
    depositor: VaultFollowerStateIF;
}

export default function VaultDepositorsTableRow(
    props: VaultDepositorsTableRowProps,
) {
    const { depositor } = props;

    const { formatNum } = useNumFormatter();

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell}`}>{depositor.user}</div>
            <div className={`${styles.cell}`}>
                {formatNum(depositor.vaultEquity, 2, true, true)}
            </div>
            <div className={`${styles.cell}`}>
                {formatNum(depositor.pnl, 2, true, true)}
            </div>
            <div className={`${styles.cell} `}>
                {formatNum(depositor.allTimePnl, 2, true, true)}
            </div>
            <div className={`${styles.cell} ${styles.sizeCell}`}>
                {depositor.daysFollowing}
            </div>
        </div>
    );
}
