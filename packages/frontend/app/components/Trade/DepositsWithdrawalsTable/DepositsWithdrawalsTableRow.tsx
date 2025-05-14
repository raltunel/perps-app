import styles from './DepositsWithdrawalsTable.module.css';

export interface TransactionData {
    time: string;
    status: string;
    network: string;
    action: string;
    valueChange: string;
    fee: string;
}

interface DepositsWithdrawalsTableRowProps {
    transaction: TransactionData;
}

export default function DepositsWithdrawalsTableRow(
    props: DepositsWithdrawalsTableRowProps,
) {
    const { transaction } = props;

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell} ${styles.timeCell}`}>
                {transaction.time}
            </div>
            <div className={`${styles.cell} ${styles.statusCell}`}>
                {transaction.status}
            </div>
            <div className={`${styles.cell} ${styles.networkCell}`}>
                {transaction.network}
            </div>
            <div className={`${styles.cell} ${styles.actionCell}`}>
                {transaction.action}
            </div>
            <div className={`${styles.cell} ${styles.valueChangeCell}`}>
                {transaction.valueChange}
            </div>
            <div className={`${styles.cell} ${styles.feeCell}`}>
                {transaction.fee}
            </div>
        </div>
    );
}
