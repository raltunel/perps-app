import SortIcon from '../SortIcon';
import styles from '../VaultRow/VaultRow.module.css';

export default function VaultRowHeader() {
  const handleSort = (key: string) => {
    console.log(`Sorting by: ${key}`);
  };

  const tableHeaders = [
    {
      name: 'Vault',
      key: 'vault',
      sortable: false,
      onClick: null,
      className: 'vaultCell',
    },
    {
      name: 'Leader',
      key: 'leader',
      sortable: false,
      onClick: null,
      className: 'leaderCell',
    },
    {
      name: 'APR',
      key: 'apr',
      sortable: true,
      onClick: () => handleSort('apr'),
      className: 'aprCell',
    },
    {
      name: 'TVL',
      key: 'tvl',
      sortable: true,
      onClick: () => handleSort('tvl'),
      className: 'tvlCell',
    },
    {
      name: 'Your Deposit',
      key: 'deposit',
      sortable: true,
      onClick: () => handleSort('deposit'),
      className: 'depositCell',
    },
    {
      name: 'Age (days)',
      key: 'age',
      sortable: true,
      onClick: () => handleSort('age'),
      className: 'ageCell',
    },
    {
      name: 'Snapshot',
      key: 'snapshot',
      sortable: false,
      onClick: null,
      className: 'snapshotCell',
    },
  ];

  return (
    <div className={styles.container}>
      {tableHeaders.map((header, idx) => (
        <div
          key={JSON.stringify(header)}
          className={`${styles.cell} ${styles.headerCell} ${styles[header.className]}`}
        >
          {header.name}{' '}
          {header.sortable && <SortIcon/>}
        </div>
      ))}
      {/* <div className={styles.cell}>{vault.name}</div>
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
      </div> */}
    </div>
  );
}
