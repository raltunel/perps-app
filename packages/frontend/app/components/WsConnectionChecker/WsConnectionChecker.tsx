import { useEffect, useRef } from 'react';
import styles from './WsConnectionChecker.module.css';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useDebugStore } from '~/stores/DebugStore';
import NoConnectionIndicator from '../NoConnectionIndicator/NoConnectionIndicator';
import WsReconnectingIndicator from '../WsReconnectingIndicator/WsReconnectingIndicator';

export default function WsConnectionChecker() {
    // Use memoized value to prevent unnecessary re-renders
    const { setIsWsSleepMode } = useDebugStore();
    const isTabPassive = useRef(false);
    const sleepModeTimeout = useRef<NodeJS.Timeout | null>(null);
    const { setInternetConnected, internetConnected, wsReconnecting } =
        useTradeDataStore();

    useEffect(() => {
        const onlineListener = () => {
            setInternetConnected(true);
        };
        const offlineListener = () => {
            setInternetConnected(false);
        };
        const visibilityListener = () => {
            if (document.visibilityState === 'hidden') {
                isTabPassive.current = true;
                if (sleepModeTimeout.current) {
                    clearTimeout(sleepModeTimeout.current);
                }
                sleepModeTimeout.current = setTimeout(() => {
                    if (isTabPassive.current) {
                        setIsWsSleepMode(true);
                        console.log('>>> pause ws', new Date().toISOString());
                    }
                }, 10000);
            } else {
                isTabPassive.current = false;
                if (sleepModeTimeout.current) {
                    clearTimeout(sleepModeTimeout.current);
                }
                setIsWsSleepMode(false);
                console.log('>>> resume ws', new Date().toISOString());
            }
        };

        window.addEventListener('online', onlineListener);
        window.addEventListener('offline', offlineListener);
        window.addEventListener('visibilitychange', visibilityListener);

        return () => {
            window.removeEventListener('online', onlineListener);
            window.removeEventListener('offline', offlineListener);
            window.removeEventListener('visibilitychange', visibilityListener);
            if (sleepModeTimeout.current) {
                clearTimeout(sleepModeTimeout.current);
            }
        };
    }, []);

    return (
        <>
            {!internetConnected && <NoConnectionIndicator />}
            {wsReconnecting && <WsReconnectingIndicator />}
        </>
    );
}
