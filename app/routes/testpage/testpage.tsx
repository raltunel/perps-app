import styles from './testpage.module.css';
import { type useModalIF, useModal } from "~/hooks/useModal";
import Notification from '~/components/Notifications/Notification';
import { useEffect, useState } from 'react';
import Modal from '~/components/Modal/Modal';

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

    useEffect(() => {
        console.log(notifications);
    }, [notifications]);

    const modalControl: useModalIF = useModal('closed');

    return (
        <div className={styles.testpage}>
            {/* interactable to open modal on user action */}
            <button onClick={() => addNotification()}>
                Open Modal
            </button>
            {/* format to insantiate modal in the DOM */}
            { notifications.length &&
                <Modal>
                    {
                        notifications.map((n: notificationIF, i) => 
                            <Notification
                                key={JSON.stringify(n) + i.toString()}
                                status='pending'
                                dismiss={() => null}
                            />
                        )
                    }
                </Modal>
            }
        </div>
    );
}
