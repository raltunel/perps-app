import { useEffect, useState } from 'react';
import styles from './Notifications.module.css';
import Notification from './Notification';

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

export interface notificationIF {
    title: string;
    message: string;
    icon: notificationType;
    oid: number;
}

export default function Notifications() {
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
            ...notifications.slice(notifications.length - 2), nextNotification,
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

    function addNotificationOnKeypress(trigger: KeyboardEvent): void {
        trigger.key === 'a' && addNotification();
    }

    useEffect(() => {
        // Add event listener to the document
        document.addEventListener("keydown", addNotificationOnKeypress);

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener("keydown", addNotificationOnKeypress);
        };
    }, [addNotificationOnKeypress]);


    return (
        <div className={styles.notifications}>
            {
                notifications.map((n: notificationIF) => (
                    <Notification
                        key={JSON.stringify(n)}
                        data={n}
                        dismiss={removeNotification}
                    />
                ))
            }
        </div>
    );
}