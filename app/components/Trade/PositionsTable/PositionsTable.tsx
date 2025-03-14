import PositionsTableHeader from './PositionsTableHeader';
import PositionsTableRow, { type PositionData } from './PositionsTableRow';
import styles from './PositionsTable.module.css';
import { positionsData } from './data';

export default function PositionsTable() {
  return (
    <div className={styles.tableWrapper}>
      <PositionsTableHeader />
      <div className={styles.tableBody}>
        {positionsData.map((position, index) => (
          <PositionsTableRow key={`position-${index}`} position={position} />
        ))}
        
        {positionsData.length === 0 && (
          <div className={styles.rowContainer} style={{ justifyContent: 'center', padding: '2rem 0' }}>
            No open positions
          </div>
        )}
      </div>
    </div>
  );
}