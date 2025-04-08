import PositionsTableHeader from './PositionsTableHeader';
import PositionsTableRow from './PositionsTableRow';
import styles from './PositionsTable.module.css';
import { positionsData } from './data';
import { useTradeDataStore } from '~/stores/TradeDataStore';

export default function PositionsTable() {

  const {positions} = useTradeDataStore();
  const limit = 10;

  return (
    <div className={styles.tableWrapper}>
      <PositionsTableHeader />
      <div className={styles.tableBody}>
        {positions.slice(0, limit).map((position, index) => (
          <PositionsTableRow key={`position-${index}`} position={position} />
        ))}
        
        {positions.length === 0 && (
          <div className={styles.rowContainer} style={{ justifyContent: 'center', padding: '2rem 0' }}>
            No open positions
          </div>
        )}
      </div>
    </div>
  );
}