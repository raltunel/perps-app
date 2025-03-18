import { ImSpinner8 } from 'react-icons/im';
import { IoCheckmarkCircleOutline, IoClose } from 'react-icons/io5';
import styles from './Notification.module.css';
import { useEffect, useRef } from 'react';
import type { notificationIF } from '~/stores/NotificationStore';

interface propsIF {
    data: notificationIF;
    dismiss: (id: number) => void;
}

export default function Notification(props: propsIF) {
    const { data, dismiss } = props;

    const createdAt = useRef<number>(Date.now());

    const DISMISS_AFTER = 5000;

    useEffect(() => {
        const autoDismiss: NodeJS.Timeout = setTimeout(
            () => dismiss(data.oid),
            DISMISS_AFTER - (Date.now() - createdAt.current),
        );
        return () => clearTimeout(autoDismiss);
    }, [dismiss]);

    const ICON_SIZE = 24;

    return (
        <section className={styles.notification}>
            <header>
                <div className={styles.header_content}>
                    {
                        data.icon === 'spinner' &&
                        <ImSpinner8 size={ICON_SIZE} color='var(--accent1)' />
                    }
                    {
                        data.icon === 'check' &&
                        <IoCheckmarkCircleOutline size={ICON_SIZE} color='var(--accent1)' />
                    }
                    <h2>{data.title}</h2>
                </div>
                <IoClose
                    className={styles.close}
                    size={ICON_SIZE}
                    onClick={() => dismiss(data.oid)}
                />
            </header>
            <p>{data.message} {data.oid}</p>
        </section>
    );
}