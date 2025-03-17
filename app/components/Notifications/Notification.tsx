import { IoCheckmarkCircleOutline, IoClose } from 'react-icons/io5';
import styles from './Notification.module.css';
import { ImSpinner8 } from 'react-icons/im';

type statuses = 'pending'|'complete';

interface propsIF {
    status: statuses;
    dismiss: () => void;
}

export default function Notification(props: propsIF) {
    const { status, dismiss } = props;

    return (
        <section className={styles.notification}>
            <header>
                <div className={styles.header_content}>
                    {
                        status === 'pending' &&
                        <ImSpinner8 size={24} color={'var(--accent1)'} />
                    }
                    {
                        status === 'complete' &&
                        <IoCheckmarkCircleOutline size={24} color={'var(--accent1)'} />
                    }
                    <h2>Leverage Mode Changed</h2>
                </div>
                <IoClose className={styles.close} onClick={dismiss} />
            </header>
            <p>Switched to 100x Leverage</p>
        </section>
    );
}