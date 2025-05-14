import styles from './ActiveTwapTable.module.css';

export interface ActiveTwapData {
    coin: string;
    size: string;
    executedSize: string;
    averagePrice: string;
    runningTime: string;
    reduceOnly: string;
    creationTime: string;
}

interface ActiveTwapTableRowProps {
    twap: ActiveTwapData;
    onTerminate: (coin: string) => void;
}

export default function ActiveTwapTableRow(props: ActiveTwapTableRowProps) {
    const { twap, onTerminate } = props;

    const handleTerminate = () => {
        onTerminate(twap.coin);
    };

    return (
        <div className={styles.rowContainer}>
            <div className={`${styles.cell} ${styles.coinCell}`}>
                {twap.coin}
            </div>
            <div className={`${styles.cell} ${styles.sizeCell}`}>
                {twap.size}
            </div>
            <div className={`${styles.cell} ${styles.executedSizeCell}`}>
                {twap.executedSize}
            </div>
            <div className={`${styles.cell} ${styles.averagePriceCell}`}>
                {twap.averagePrice}
            </div>
            <div className={`${styles.cell} ${styles.runningTimeCell}`}>
                {twap.runningTime}
            </div>
            <div className={`${styles.cell} ${styles.reduceOnlyCell}`}>
                {twap.reduceOnly}
            </div>
            <div className={`${styles.cell} ${styles.creationTimeCell}`}>
                {twap.creationTime}
            </div>
            <div className={`${styles.cell} ${styles.terminateCell}`}>
                <button
                    className={styles.terminateButton}
                    onClick={handleTerminate}
                >
                    Terminate
                </button>
            </div>
        </div>
    );
}
