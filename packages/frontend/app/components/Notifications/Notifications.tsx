import styles from './Notifications.module.css';
import Notification from './Notification';
import { useAppOptions } from '~/stores/AppOptionsStore';
import {
    useNotificationStore,
    type notificationIF,
    type NotificationStoreIF,
} from '~/stores/NotificationStore';
import { useDebugStore } from '~/stores/DebugStore';
import { useCallback, useEffect, useRef } from 'react';
import { useSdk } from '~/hooks/useSdk';
import { WsChannels } from '~/utils/Constants';

export default function Notifications() {
    // boolean to suppress notifications if toggled by user
    const { enableTxNotifications, enableBackgroundFillNotif } =
        useAppOptions();

    // notification data from which to generate DOM elements
    const data: NotificationStoreIF = useNotificationStore();

    const backgroundFillNotifRef = useRef(false);
    backgroundFillNotifRef.current = enableBackgroundFillNotif;

    // debug store to import sample wallet addres to use
    const { debugWallet } = useDebugStore();

    const { info } = useSdk();

    // use effect to subscribe to notifications
    useEffect(() => {
        if (!info) return;
        if (!debugWallet.address) return;

        const { unsubscribe } = info.subscribe(
            {
                type: WsChannels.NOTIFICATION,
                user: debugWallet.address,
            },
            postNotification,
        );

        return unsubscribe;
    }, [debugWallet, info]);

    const postNotification = useCallback((payload) => {
        if (!payload || !payload.data) return;

        const notification = payload.data.notification;

        if (backgroundFillNotifRef.current && notification) {
            // split the payload into title and message
            const title = notification.split(':')[0];
            const message = notification.split(':')[1];

            // add to store
            data.add({
                title: title,
                message: message,
                icon: 'check',
            });
        }
    }, []);

    return (
        <div className={styles.notifications}>
            {enableTxNotifications &&
                data.notifications.map((n: notificationIF) => (
                    <Notification
                        key={JSON.stringify(n)}
                        data={n}
                        dismiss={data.remove}
                    />
                ))}
        </div>
    );
}
