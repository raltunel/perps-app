import styles from './FundingHistoryTable.module.css';

export interface FundingHistoryData {
    time: string;
    coin: string;
    size: string;
    positionSide: 'Long' | 'Short';
    payment: string;
    rate: string;
}

interface FundingHistoryTableRowProps {
    fundingHistory: FundingHistoryData;
}

export default function FundingHistoryTableRow(
    props: FundingHistoryTableRowProps,
) {
    const { fundingHistory } = props;

    // Determine if payment is negative (starts with '-')
    const isNegativePayment = fundingHistory.payment.startsWith('-');

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell} ${styles.timeCell}`}>
                {fundingHistory.time}
            </div>
            <div className={`${styles.cell} ${styles.coinCell}`}>
                {fundingHistory.coin}
            </div>
            <div className={`${styles.cell} ${styles.sizeCell}`}>
                {fundingHistory.size}
            </div>
            <div
                className={`${styles.cell} ${styles.positionSideCell} ${
                    fundingHistory.positionSide === 'Long'
                        ? styles.longPosition
                        : styles.shortPosition
                }`}
            >
                {fundingHistory.positionSide}
            </div>
            <div
                className={`${styles.cell} ${styles.paymentCell} ${
                    isNegativePayment
                        ? styles.negativePayment
                        : styles.positivePayment
                }`}
            >
                {fundingHistory.payment}
            </div>
            <div className={`${styles.cell} ${styles.rateCell}`}>
                {fundingHistory.rate}
            </div>
        </div>
    );
}
