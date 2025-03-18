import styles from './Notifications.module.css';
import Notification from './Notification';
import { useAppOptions, type useAppOptionsIF } from '~/stores/AppOptionsStore';
import { useNotificationStore, type notificationIF, type NotificationStoreIF } from '~/stores/NotificationStore';
import { useEffect } from 'react';
import { useKeydown } from '~/hooks/useKeydown';

export default function Notifications() {

    const data: NotificationStoreIF = useNotificationStore();
    const activeOptions: useAppOptionsIF = useAppOptions();

    function addNotificationOnKeypress(trigger: KeyboardEvent): void {
        trigger.key === 'a' && data.add();
    }

    // run fn `data.add` when the user presses the 'a' key
    useKeydown('a', data.add);

    return (
        <div className={styles.notifications}>
            {
                activeOptions.enableTxNotifications && (
                    data.notifications.map((n: notificationIF) => (
                        <Notification
                            key={JSON.stringify(n)}
                            data={n}
                            dismiss={data.remove}
                        />
                    ))
                )
            }
        </div>
    );
}