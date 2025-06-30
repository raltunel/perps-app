import { DEMO_USER, Exchange, Info, type Environment } from '@perps-app/sdk';
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useDebugStore } from '~/stores/DebugStore';
import { useIsClient } from './useIsClient';
import { useAppStateStore } from '~/stores/AppStateStore';
import { WS_SLEEP_MODE_STASH_CONNECTION } from '~/utils/Constants';

type SdkContextType = {
    info: Info | null;
    exchange: Exchange | null;
};

const SdkContext = createContext<SdkContextType | undefined>(undefined);

export const SdkProvider: React.FC<{
    environment: Environment;
    children: React.ReactNode;
}> = ({ environment, children }) => {
    const isClient = useIsClient();

    const [info, setInfo] = useState<Info | null>(null);
    const [exchange, setExchange] = useState<Exchange | null>(null);
    const [shouldReconnect, setShouldReconnect] = useState(false);
    const stashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const {
        internetConnected,
        setWsReconnecting,
        isWsStashed,
        setIsWsStashed,
        isTabActive,
    } = useAppStateStore();
    const { isWsSleepMode, setIsWsSleepMode } = useDebugStore();

    // commit to trigger deployment
    useEffect(() => {
        if (!isClient) return;
        if (!info) {
            const newInfo = new Info({
                environment,
                skipWs: false,
                // isDebug: true, // TODO: remove in prod
            });

            setInfo(newInfo);
        } else {
            info.setEnvironment(environment);
        }
        if (!exchange) {
            setExchange(
                new Exchange(
                    {},
                    {
                        environment,
                        accountAddress: DEMO_USER,
                        // isDebug: true, // TODO: remove in prod
                    },
                ),
            );
        } else {
            exchange.setEnvironment(environment);
        }
    }, [isClient, environment]);

    useEffect(() => {
        if (!internetConnected) {
            setShouldReconnect(true);
        }
    }, [internetConnected]);

    useEffect(() => {
        if (!isClient) return;
        if (!isTabActive) return;

        if (isWsStashed) {
            info?.wsManager?.connectAfterStash();
            setIsWsStashed(false);
            setShouldReconnect(false);
            console.log('>>> connected after stash', new Date().toISOString());
            return;
        }

        if (internetConnected && shouldReconnect) {
            console.log('>>> reconnect alternate', new Date().toISOString());
            info?.wsManager?.reconnect();
            setWsReconnecting(true);
            setShouldReconnect(false);
        }

        const reconnectInterval = setInterval(() => {
            if (info?.wsManager?.isWsReady()) {
                setWsReconnecting(false);
                clearInterval(reconnectInterval);
            }
        }, 200);

        return () => {
            clearInterval(reconnectInterval);
        };
    }, [
        internetConnected,
        isClient,
        info,
        shouldReconnect,
        isWsStashed,
        isTabActive,
    ]);

    useEffect(() => {
        if (!isClient) return;
        if (isWsSleepMode) {
            info?.wsManager?.setSleepMode(true);
        } else {
            info?.wsManager?.setSleepMode(false);
        }
    }, [isWsSleepMode, info]);

    useEffect(() => {
        if (!isTabActive) {
            if (stashTimeoutRef.current) {
                clearTimeout(stashTimeoutRef.current);
            }
            stashTimeoutRef.current = setTimeout(() => {
                console.log('>>> stashing', new Date().toISOString());
                info?.wsManager?.stashWebsocket();
                setIsWsStashed(true);
            }, WS_SLEEP_MODE_STASH_CONNECTION);
        } else {
            if (stashTimeoutRef.current) {
                clearTimeout(stashTimeoutRef.current);
            }
            setIsWsStashed(false);
        }

        return () => {
            if (stashTimeoutRef.current) {
                clearTimeout(stashTimeoutRef.current);
            }
        };
    }, [isTabActive, info]);

    return (
        <SdkContext.Provider value={{ info: info, exchange: exchange }}>
            {children}
        </SdkContext.Provider>
    );
};

export const useSdk = () => {
    const context = useContext(SdkContext);
    if (!context) {
        throw new Error('useSdk must be used within a SdkProvider');
    }
    return context;
};
