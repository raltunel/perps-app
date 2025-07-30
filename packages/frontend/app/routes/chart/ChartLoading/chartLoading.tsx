import styles from './chartLoading.module.css';
export default function ChartLoading() {
    return (
        <div className={`${styles.spinner_container}`}>
            <div className={`${styles.spinner}`}></div>
        </div>
    );
}
