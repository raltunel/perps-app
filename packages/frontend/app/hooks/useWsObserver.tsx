import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useIsClient } from './useIsClient';
import { Info, WebsocketManager, type Environment } from '@perps-app/sdk';
import { useDebugStore } from '~/stores/DebugStore';
import { useSdk } from './useSdk';
import { useWorker } from './useWorker';
import { useWorkerAgenda } from './useWorkerAgenda';

export type WsSubscriptionConfig = {
    handler: (payload: any) => void;
    payload?: any;
    single?: boolean;
    subscriptionId?: number;
};

type WsObserverContextType = {
    subscribe: (key: string, config: WsSubscriptionConfig) => void;
    unsubscribe: (key: string, config: WsSubscriptionConfig) => void;
    unsubscribeAllByChannel: (channel: string) => void;
};
export enum WsChannels {
    ORDERBOOK = 'l2Book',
    ORDERBOOK_TRADES = 'trades',
    USER_FILLS = 'userFills',
    USER_HISTORICAL_ORDERS = 'userHistoricalOrders',
    WEB_DATA2 = 'webData2',
    ACTIVE_COIN_DATA = 'activeAssetCtx',
    NOTIFICATION = 'notification',
    CANDLE = 'candle',
}
const WsObserverContext = createContext<WsObserverContextType | undefined>(
    undefined,
);

export const WsObserverProvider: React.FC<{
    url: string;
    children: React.ReactNode;
    wsEnvironment: string;
}> = ({ url, children, wsEnvironment }) => {
    const { info } = useSdk();
    const socketManagerRef = useRef<WebsocketManager | null | undefined>(null);
    socketManagerRef.current = info?.wsManager;

    const workers = useRef<Map<string, Worker>>(new Map());
    const subscriptions = useRef<Map<string, WsSubscriptionConfig[]>>(
        new Map(),
    );

    const { checkCustomWorker } = useWorkerAgenda();

    // const { isWsEnabled } = useDebugStore();

    const [sdkReady, setSdkReady] = useState(
        socketManagerRef.current?.isWsReady(),
    );

    function extractChannelFromPayload(raw: string): string {
        const match = raw.match(/"channel"\s*:\s*"([^"]+)"/);
        return match ? match[1] : '';
    }

    useEffect(() => {
        // that interval checks if the sdk websocket connection is ready
        // once it's ready, waiting subscriptions has been registered through websocket
        const interval = setInterval(() => {
            if (sdkReady !== socketManagerRef.current?.isWsReady()) {
                setSdkReady(socketManagerRef.current?.isWsReady());
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // this use effect will register pending subscriptions once sdk ws connection is ready
    useEffect(() => {
        if (socketManagerRef.current?.isWsReady() === true) {
            subscriptions.current.forEach((configs, key) => {
                configs.forEach((config) => {
                    const subscriptionId = wsSubscribe(
                        key,
                        config.payload || {},
                    );
                    if (subscriptionId) {
                        config.subscriptionId = subscriptionId;
                    }
                });
            });
        }
    }, [sdkReady]);

    const wsSubscribe = (type: string, payload: any): number | undefined => {
        if (socketManagerRef.current && socketManagerRef.current.isWsReady()) {
            const worker = checkCustomWorker(type);
            if (worker) {
                console.log('>>> there is a custom worker for', type);
                socketManagerRef.current.registerWorker(type, worker);
            }

            const subscriptionId = socketManagerRef.current.subscribe(
                {
                    type: type,
                    ...payload,
                },
                (msg) => {
                    subscriptions.current.forEach((configs, key) => {
                        if (key === type) {
                            configs.forEach((config) => {
                                config.handler(msg);
                            });
                        }
                    });
                    // console.log('>>> ws subscribe', msg);
                },
            );
            return subscriptionId;
        }
    };

    const wsUnsubscribe = (
        type: string,
        payload: any,
        subscriptionId?: number,
    ) => {
        if (
            socketManagerRef.current &&
            subscriptionId &&
            socketManagerRef.current.isWsReady()
        ) {
            socketManagerRef.current.unsubscribe(
                {
                    type: type,
                    ...payload,
                },
                subscriptionId,
            );
        } else {
            if (socketManagerRef.current) {
                console.error('No subscription id found', {
                    type,
                    payload,
                });
            }
        }
    };

    // this method is called by react components
    const subscribe = (key: string, config: WsSubscriptionConfig) => {
        // add subscripton in hook
        if (!subscriptions.current.has(key)) {
            subscriptions.current.set(key, []);
        }

        if (config.single) {
            const currentSubs = subscriptions.current.get(key) || [];
            currentSubs.forEach((sub) => {
                wsUnsubscribe(key, sub.payload || {}, sub.subscriptionId);
            });
            subscriptions.current.set(key, [config]);
        } else {
            subscriptions.current.get(key)!.push(config);
        }

        // add subscription through websocket context
        const subscriptionId = wsSubscribe(key, config.payload || {});
        if (subscriptionId) {
            config.subscriptionId = subscriptionId;
        }
    };

    // unsubscribe all subscriptions by channel
    const unsubscribeAllByChannel = (channel: string) => {
        if (subscriptions.current.has(channel)) {
            subscriptions.current.get(channel)!.forEach((config) => {
                wsUnsubscribe(
                    channel,
                    config.payload || {},
                    config.subscriptionId,
                );
            });
        }
        subscriptions.current.delete(channel);
    };

    const unsubscribe = (key: string, config: WsSubscriptionConfig) => {
        if (subscriptions.current.has(key)) {
            const configs = subscriptions.current
                .get(key)!
                .filter((c) => c !== config);
            if (configs.length === 0) {
                subscriptions.current.delete(key);
            } else {
                subscriptions.current.set(key, configs);
            }
        }
    };

    const initWorker = (type: string) => {
        if (workers.current.has(type)) {
            return;
        }

        switch (type) {
            case WsChannels.WEB_DATA2:
                const w1 = new Worker(
                    new URL(
                        './../processors/workers/webdata2.worker.ts',
                        import.meta.url,
                    ),
                    { type: 'module' },
                );

                w1.onmessage = (event) => {
                    const subs = subscriptions.current.get(event.data.channel);
                    if (subs) {
                        subs.forEach((config) => {
                            config.handler(event.data);
                        });
                    }
                };
                workers.current.set(type, w1);
                return w1;
            default:
                const w2 = new Worker(
                    new URL(
                        './../processors/workers/jsonParser.worker.ts',
                        import.meta.url,
                    ),
                    { type: 'module' },
                );

                w2.onmessage = (event) => {
                    const subs = subscriptions.current.get(event.data.channel);
                    if (subs) {
                        subs.forEach((config) => {
                            config.handler(event.data);
                        });
                    }
                };

                workers.current.set(type, w2);
                return w2;
        }
    };

    return (
        <WsObserverContext.Provider
            value={{ subscribe, unsubscribe, unsubscribeAllByChannel }}
        >
            {children}
        </WsObserverContext.Provider>
    );
};
export const useWsObserver = () => {
    const context = useContext(WsObserverContext);
    if (!context) {
        throw new Error(
            'useWsObserver must be used within a WsObserverProvider',
        );
    }
    return context;
};
