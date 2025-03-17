import styles from './testpage.module.css';
import { useState } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { IoCheckmarkCircleOutline, IoClose } from 'react-icons/io5';

interface propsIF {

}

type notificationType = 'spinner'|'check';

interface notificationMetaIF {
    title: string;
    messages: string[],
    icon: notificationType;
}

const notificationMeta: notificationMetaIF[] = [
    {
        title: 'Leverage Mode Changed',
        messages: [
            'Switched to Isolated Margin Mode',
            'Switched to 100x Leverage',
        ],
        icon: 'check',
    },
    {
        title: 'Sub Account Created',
        messages: [
            'Sub Account 1 Created'
        ],
        icon: 'check',
    },
];

interface notificationIF {
    title: string;
    message: string;
    icon: notificationType;
    oid: number;
}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    function makeNotificationData(): notificationIF {
        function getRandomElement<T>(a: Array<T>): T {
            const randomIndex = Math.floor(Math.random() * a.length);
            return a[randomIndex];
        }
        const meta = getRandomElement(notificationMeta);
        return ({
            title: meta.title,
            message: getRandomElement(meta.messages),
            icon: meta.icon,
            oid: makeOID(14),
        });
    }

    const [notifications, setNotifications] = useState<notificationIF[]>([]);
    function addNotification(): void {
        const nextNotification: notificationIF = makeNotificationData();
        setNotifications([
            ...notifications, nextNotification,
        ]);
    }

    function removeNotification(id: number): void {
        setNotifications(notifications.filter(
            (n: notificationIF) => n.oid !== id
        ));
    }

    function makeOID(digits: number): number {
        const min = 10 ** (digits - 1);
        const max = 10 ** digits - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return (
        <div className={styles.testpage}>
            <button onClick={() => addNotification()}>
                Add Notification
            </button>
            {!!notifications.length && <div className={styles.notifications}>
                {
                    notifications.map((n: notificationIF) => {
                        return (
                            <section className={styles.notification}>
                                <header>
                                    <div className={styles.header_content}>
                                        {
                                            n.icon === 'spinner' &&
                                            <ImSpinner8 size={24} color={'var(--accent1)'} />
                                        }
                                        {
                                            n.icon === 'check' &&
                                            <IoCheckmarkCircleOutline size={24} color={'var(--accent1)'} />
                                        }
                                        <h2>{n.title}</h2>
                                    </div>
                                    <IoClose
                                        className={styles.close}
                                        onClick={() => removeNotification(n.oid)}
                                    />
                                </header>
                                <p>{n.message} {n.oid}</p>
                            </section>
                        );
                    })
                }
            </div>}
        </div>
    );
}
