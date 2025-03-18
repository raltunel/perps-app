import styles from './Notifications.module.css';
import Notification from './Notification';
import { useAppOptions } from '~/stores/AppOptionsStore';
import {
    useNotificationStore,
    type notificationIF,
    type NotificationStoreIF
} from '~/stores/NotificationStore';
import { useKeydown } from '~/hooks/useKeydown';

export default function Notifications() {
    // notification data from which to generate DOM elements
    const data: NotificationStoreIF = useNotificationStore();

    // boolean to suppress notifications if toggled by user
    const { enableTxNotifications } = useAppOptions();

    // run fn `data.add` when the user presses the 'a' key
    useKeydown('a', data.add);

    return (
        <div className={styles.notifications}>
            {
                enableTxNotifications && (
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