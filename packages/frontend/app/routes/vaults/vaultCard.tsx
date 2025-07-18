import styles from './vaultDetails.module.css';

interface VaultCardProps {
    title: string;
    value: string;
}

export default function VaultCard(props: VaultCardProps) {
    return (
        <>
            <div className={styles.card}>
                <div className={styles.title}>{props.title}</div>
                <div className={styles.value}>{props.value}</div>
            </div>
        </>
    );
}
