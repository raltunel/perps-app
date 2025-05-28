import styles from './LoadingIndicator.module.css';

export default function LoadingIndicator() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loaderContent}>
                <div className={styles.chartContainer}>
                    {/* Chart line animation */}
                    <div className={styles.chartLine}></div>

                    {/* Animated candles */}
                    <div className={styles.candlesContainer}>
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={`candle-${i}`}
                                className={`${styles.candle} ${i % 2 === 0 ? styles.green : styles.red}`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Market indicators */}
                <div className={styles.marketIndicators}>
                    <div className={styles.indicatorGroup}>
                        <div className={styles.indicatorLabel}>
                            <span
                                className={`${styles.icon} ${styles.upIcon}`}
                            ></span>
                            <span className={styles.greenText}>Long</span>
                        </div>
                    </div>
                    <div className={styles.indicatorGroup}>
                        <div className={styles.indicatorLabel}>
                            <span
                                className={`${styles.icon} ${styles.downIcon}`}
                            ></span>
                            <span className={styles.redText}>Short</span>
                        </div>
                    </div>
                </div>

                {/* Trading volume bars */}
                <div className={styles.volumeBars}>
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={`vol-${i}`}
                            className={`${styles.volumeBar} ${i % 2 === 0 ? styles.green : styles.red}`}
                            style={{
                                height: `${10 + (i % 4) * 8}px`,
                                animationDelay: `${i * 0.07}s`,
                            }}
                        />
                    ))}
                </div>

                <div className={styles.loadingText}>Loading Trading Data</div>
            </div>
        </div>
    );
}
