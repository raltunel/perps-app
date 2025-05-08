import { useEffect, useRef, type ReactNode } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { IoCheckmarkCircleOutline, IoClose } from 'react-icons/io5';
import type { notificationIF } from '~/stores/NotificationStore';
import styles from './Notification.module.css';

interface propsIF {
    data: notificationIF;
    dismiss: (id: number) => void;
}

export default function Notification(props: propsIF) {
    const { data, dismiss } = props;
    // create and memoize the UNIX time when this element was mounted
    const createdAt = useRef<number>(Date.now());

    // time period (ms) after which to auto-dismiss the notification
    const DISMISS_AFTER = 5000;

    // logic to remove this elem from the DOM after a timeout, yes the
    // ... logic shown is convoluted, any changes will result in all
    // ... notifications being dismissed together or the timer being
    // ... reset any time a notification disappears
    useEffect(() => {
        const autoDismiss: NodeJS.Timeout = setTimeout(
            () => dismiss(data.slug),
            DISMISS_AFTER - (Date.now() - createdAt.current),
        );
        return () => clearTimeout(autoDismiss);
    }, [dismiss]);

    // px size at which to render SVG icons
    const ICON_SIZE = 24;

    // logic to add green syntax highlighting to Bought notifications
    function formatMessage(message: string): ReactNode {
        const fixedMessage: string = message.trim();
        if (fixedMessage.startsWith('Bought')) {
            const firstSpace: number = fixedMessage.indexOf(' ');
            const secondSpace: number = fixedMessage.indexOf(' ', firstSpace + 1);
            if (secondSpace !== -1) {
                const firstPart: string = fixedMessage.substring(0, secondSpace);
                const secondPart: string = fixedMessage.substring(secondSpace);
                
                return (
                    <>
                        <span style={{ color: 'var(--green)' }}>{firstPart}</span>
                        {secondPart}
                    </>
                );
            }
        }
        return fixedMessage;
    }

    return (
        <section className={styles.notification}>
            <header>
                <div className={styles.header_content}>
                    {data.icon === 'spinner' && (
                        <ImSpinner8 size={ICON_SIZE} color='var(--accent1)' />
                    )}
                    {data.icon === 'check' && (
                        <IoCheckmarkCircleOutline
                            size={ICON_SIZE}
                            color='var(--accent1)'
                        />
                    )}
                    <h2>{data.title}</h2>
                </div>
                <IoClose
                    className={styles.close}
                    size={ICON_SIZE}
                    onClick={() => dismiss(data.slug)}
                />
            </header>
            <p>{formatMessage(data.message)}</p>
        </section>
    );
}
