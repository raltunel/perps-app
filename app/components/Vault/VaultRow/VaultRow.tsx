import type { VaultDataIF } from '~/routes/vaults/data';
import styles from './VaultRow.module.css';
import { SnapshotGraph } from './SnapshotGraph';

interface VaultRowProps {
  vault: VaultDataIF;
}
export default function VaultRow(props: VaultRowProps) {
  const { vault } = props;
  return (
    <div className={styles.container}>
      <div className={styles.cell}>{vault.name}</div>
      <div className={`${styles.cell} ${styles.leaderCell}`}>
        {vault.leader}
      </div>
      <div className={`${styles.cell} ${styles.aprCell}`}>
        {vault.apr.toFixed(2)}%
      </div>
      <div className={`${styles.cell} ${styles.tvlCell}`}>
        ${vault.tvl.toLocaleString()}
      </div>
      <div className={`${styles.cell} ${styles.depositCell}`}>
        ${vault.yourDeposit.toFixed(2)}
      </div>
      <div className={`${styles.cell} ${styles.ageCell}`}>{vault.age}</div>
      <div className={`${styles.cell} ${styles.snapshotCell}`}>
        <SnapshotGraph
          data={vault.snapshot.data}
          trend={vault.snapshot.trend}
        />
      </div>
    </div>
  );
}
