import { IoCheckmarkCircleOutline, IoClose } from 'react-icons/io5';
import styles from './Notification.module.css';

export default function Notification() {
    return (
        <section className={styles.notification}>
            <header>
                <div className={styles.header_content}>
                    <IoCheckmarkCircleOutline size={24} color={'var(--accent1)'} />
                    <h2>Leverage Mode Changed</h2>
                </div>
                <IoClose className={styles.close} />
            </header>
            <p>Switched to 100x Leverage</p>
        </section>
    );
}