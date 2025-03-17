import { ImSpinner8 } from 'react-icons/im';
import { IoCheckmarkCircleOutline, IoClose } from 'react-icons/io5';
import styles from './Notification.module.css';
import type { notificationIF } from './Notifications';
import { useEffect, useRef } from 'react';

interface propsIF {
    data: notificationIF;
    dismiss: (id: number) => void;
}

export default function Notification(props: propsIF) {
    const { data, dismiss } = props;

    const createdAt = useRef<number>(Date.now());

    const DISMISS_AFTER = 3000;

    useEffect(() => {
        const autoDismiss: NodeJS.Timeout = setTimeout(
            () => dismiss(data.oid),
            DISMISS_AFTER - (Date.now() - createdAt.current),
        );
        return () => clearTimeout(autoDismiss);
    }, [dismiss]);

    return (
        <section className={styles.notification}>
            <header>
                <div className={styles.header_content}>
                    {
                        data.icon === 'spinner' &&
                        <ImSpinner8 size={24} color={'var(--accent1)'} />
                    }
                    {
                        data.icon === 'check' &&
                        <IoCheckmarkCircleOutline size={24} color={'var(--accent1)'} />
                    }
                    <h2>{data.title}</h2>
                </div>
                <IoClose
                    className={styles.close}
                    onClick={() => dismiss(data.oid)}
                />
            </header>
            <p>{data.message} {data.oid}</p>
        </section>
    );
}