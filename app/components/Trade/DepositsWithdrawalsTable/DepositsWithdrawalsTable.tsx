import DepositsWithdrawalsTableHeader from './DepositsWithdrawalsTableHeader';
import DepositsWithdrawalsTableRow from './DepositsWithdrawalsTableRow';
import { transactionsData } from './data';
import styles from './DepositsWithdrawalsTable.module.css'
export default function DepositsWithdrawalsTable() {
  const handleViewAll = () => {
    console.log('View all transactions');
  };

  const handleExportCSV = () => {
    console.log('Export as CSV');
    
  };

  return (
    <div className={styles.tableWrapper}>
      <DepositsWithdrawalsTableHeader />
      <div className={styles.tableBody}>
        {transactionsData.map((transaction, index) => (
          <DepositsWithdrawalsTableRow key={`transaction-${index}`} transaction={transaction} />
        ))}
        
        {transactionsData.length === 0 && (
          <div className={styles.rowContainer} style={{ justifyContent: 'center', padding: '2rem 0' }}>
            No transactions to display
          </div>
        )}
      </div>
      
      {transactionsData.length > 0 && (
        <div className={styles.actionsContainer}>
          <button className={styles.actionLink} onClick={handleViewAll}>
            View All
          </button>
          <button className={styles.actionLink} onClick={handleExportCSV}>
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
}