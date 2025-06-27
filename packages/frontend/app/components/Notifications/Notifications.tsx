import { AnimatePresence, motion } from 'framer-motion'; // <-- Import Framer Motion
import { useCallback, useEffect, useRef } from 'react';
import { useSdk } from '~/hooks/useSdk';
import { useAppOptions } from '~/stores/AppOptionsStore';
import { useDebugStore } from '~/stores/DebugStore';
import {
    useNotificationStore,
    type notificationIF,
    type NotificationStoreIF,
} from '~/stores/NotificationStore';
import { WsChannels } from '~/utils/Constants';
import Notification from './Notification';
import styles from './Notifications.module.css';
import type { NotificationMsg } from '@perps-app/sdk/src/utils/types';

export default function Notifications() {
    const { enableTxNotifications, enableBackgroundFillNotif } =
        useAppOptions();
    const data: NotificationStoreIF = useNotificationStore();
    const backgroundFillNotifRef = useRef(false);
    backgroundFillNotifRef.current = enableBackgroundFillNotif;
    const { debugWallet } = useDebugStore();
    const { info } = useSdk();

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

    const postNotification = useCallback((payload: NotificationMsg) => {
        if (!payload || !payload.data) return;
        const notification = payload.data.notification;
        if (backgroundFillNotifRef.current && notification) {
            const title = notification.split(':')[0];
            const message = notification.split(':')[1];
            data.add({
                title: title,
                message: message,
                icon: 'check',
            });
        }
    }, []);

    return (
        <div className={styles.notifications}>
            <AnimatePresence>
                {enableTxNotifications &&
                    data.notifications.map((n: notificationIF) => (
                        <motion.div
                            key={JSON.stringify(n)} // Ensure uniqueness
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            layout // Optional: enables smooth stacking animations
                        >
                            <Notification data={n} dismiss={data.remove} />
                        </motion.div>
                    ))}
            </AnimatePresence>
        </div>
    );
}
