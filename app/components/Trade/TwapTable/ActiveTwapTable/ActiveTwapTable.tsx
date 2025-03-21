import ActiveTwapTableHeader from './ActiveTwapTableHeader';
import ActiveTwapTableRow from './ActiveTwapTableRow';
import styles from './ActiveTwapTable.module.css';
import { activeTwapsData } from './data';

export default function ActiveTwapTable() {
  const handleTerminate = (coin: string) => {
    console.log(`Terminating TWAP for ${coin}`);
  };

  return (
    <div className={styles.tableWrapper}>
      <ActiveTwapTableHeader />
      <div className={styles.tableBody}>
        {activeTwapsData.length > 0 ? (
          activeTwapsData.map((twap, index) => (
            <ActiveTwapTableRow 
              key={`twap-${index}`} 
              twap={twap} 
              onTerminate={handleTerminate} 
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            No active TWAPs
          </div>
        )}
      </div>
    </div>
  );
}