import styles from './TakeProfitsModal.module.css';
export default function TakeProfitsModal() {
    const infoData = [
        { label: 'Market', value: 'BTC' },
        { label: 'Position', value: '0.235 BTC' },
        { label: 'Entry Price', value: '84,765.90' },
        { label: 'Mark Price', value: '96,965.17' },
    ];
    return (
        <div className={styles.container}>
            <section className={styles.infoContainer}>
                {infoData.map((item, index) => (
                    <div key={index} className={styles.infoItem}>
                        <p>{item.label}</p>
                        <p>{item.value}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
