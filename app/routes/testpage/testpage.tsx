import styles from './testpage.module.css';
import { useEffect, useState } from 'react';
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
}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    function makeNotificationData() {
        function getRandomElement<T>(a: Array<T>): T {
            const randomIndex = Math.floor(Math.random() * a.length);
            return a[randomIndex];
        }
        const meta = getRandomElement(notificationMeta);
        return ({
            title: meta.title,
            message: getRandomElement(meta.messages),
            icon: meta.icon,
        });
    }

    const [notifications, setNotifications] = useState<notificationIF[]>([]);
    function addNotification(): void {
        const nextNotification: notificationIF = makeNotificationData();
        setNotifications([
            ...notifications, nextNotification,
        ]);
    }

    return (
        <div className={styles.testpage}>
            <button onClick={() => addNotification()}>
                Add Notification
            </button>
            {!!notifications.length && <div className={styles.notifications}>
                {
                    notifications.map((n: notificationIF, i) => {
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
                                        onClick={() => null}
                                    />
                                </header>
                                <p>{n.message}</p>
                            </section>
                        );
                    })
                }
            </div>}
        </div>
    );
}
