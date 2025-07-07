import type { NotificationMsg } from '@perps-app/sdk/src/utils/types';
import { AnimatePresence, motion } from 'framer-motion'; // <-- Import Framer Motion
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useLocation } from 'react-router';
import { useSdk } from '~/hooks/useSdk';
import { useVersionCheck } from '~/hooks/useVersionCheck';
import { useViewed } from '~/stores/AlreadySeenStore';
import { useAppOptions } from '~/stores/AppOptionsStore';
import { useDebugStore } from '~/stores/DebugStore';
import {
    useNotificationStore,
    type notificationIF,
    type NotificationStoreIF,
} from '~/stores/NotificationStore';
import { WsChannels } from '~/utils/Constants';
import SimpleButton from '../SimpleButton/SimpleButton';
import Notification from './Notification';
import styles from './Notifications.module.css';

interface NewsItemIF {
    headline: string;
    body: string;
    id: string;
}

export default function Notifications() {
    const { enableTxNotifications, enableBackgroundFillNotif } =
        useAppOptions();
    const data: NotificationStoreIF = useNotificationStore();
    const backgroundFillNotifRef = useRef(false);
    backgroundFillNotifRef.current = enableBackgroundFillNotif;
    const { debugWallet } = useDebugStore();
    const { info } = useSdk();

    const { showReload, setShowReload } = useVersionCheck();

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

    const version = null;

    // logic to fetch news data asynchronously
    const [news, setNews] = useState<NewsItemIF[]>([]);
    useEffect(() => {
        fetch('/announcements.json', { cache: 'no-store' })
            .then((res) => res.json())
            .then((formatted) => {
                setNews(formatted.news);
            });
        const interval = setInterval(
            () => {
                fetch('/announcements.json', { cache: 'no-store' })
                    .then((res) => res.json())
                    .then((formatted) => {
                        setNews(formatted.news);
                    });
            },
            5 * 60 * 1000,
        );
        return () => clearInterval(interval);
    }, []);

    // logic to prevent a user from seeing a news item repeatedly
    const alreadyViewed = useViewed();

    // apply filter to messages received by the app
    const unseen: {
        messages: {
            headline: string;
            body: string;
        }[];
        hashes: string[];
    } = useMemo(() => {
        // output variable for human-readable messages
        const messages: {
            headline: string;
            body: string;
        }[] = [];
        // output variable for message hashes
        const hashes: string[] = [];
        // iterate over news items, handle ones not previously seen
        news.forEach((n: NewsItemIF) => {
            if (!alreadyViewed.checkIfViewed(n.id)) {
                messages.push({
                    headline: n.headline,
                    body: n.body,
                });
                hashes.push(n.id);
            }
        });
        // return output variables
        return {
            messages,
            hashes,
        };
    }, [
        // recalculate for changes in the base data set
        news,
        // recalculate for changes in the list of viewed messages
        alreadyViewed,
    ]);

    const [userClosedNews, setUserClosedNews] = useState<boolean>(false);

    const { pathname } = useLocation();

    if (pathname === '/') {
        return <></>;
    }

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
            {showReload && (
                <div className={styles.new_version_available}>
                    <header>
                        <div />
                        <div>🚀</div>
                        <MdClose
                            onClick={() => setShowReload(false)}
                            color='var(--text2)'
                            size={16}
                        />
                    </header>
                    <div className={styles.text_content}>
                        <h3>New Version Available</h3>
                        <p>
                            {version
                                ? `Version ${version} is ready to install with new features and improvements.`
                                : 'A new version is ready with exciting updates and bug fixes.'}
                        </p>
                    </div>
                    <SimpleButton
                        onClick={() => {
                            window.location.reload();
                            setShowReload(false);
                        }}
                    >
                        Update Now
                    </SimpleButton>
                </div>
            )}
            {unseen.messages.length > 0 && !userClosedNews && (
                <div className={styles.news}>
                    <header>
                        <h4>News</h4>
                        <MdClose
                            color='var(--text2)'
                            size={16}
                            onClick={() => {
                                setUserClosedNews(true);
                                alreadyViewed.markAsViewed(unseen.hashes);
                            }}
                        />
                    </header>
                    <ul>
                        {unseen.messages.map(
                            (n: { headline: string; body: string }) => (
                                <li>
                                    <h5>{n.headline}</h5>
                                    <p>{n.body}</p>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
