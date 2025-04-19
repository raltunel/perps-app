import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import { useIsClient } from './useIsClient';
import { Info, type Environment } from '@perps-app/sdk';

export type WsSubscriptionConfig = {
    handler: (payload: any) => void;
    payload?: any;
    single?: boolean;
};

type WsObserverContextType = {
    // returns subscription id
    subscribe: (key: string, config: WsSubscriptionConfig) => number;
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
    environment: Environment;
    children: React.ReactNode;
}> = ({ environment, children }) => {
    const workers = useRef<Map<string, Worker>>(new Map());
    const infoRef = useRef<Info | null>(null);
    const subscriptionsRef = useRef<
        Map<
            string,
            Array<{
                config: WsSubscriptionConfig;
                subscription: any;
                id: number;
            }>
        >
    >(new Map());

    const isClient = useIsClient();

    useEffect(() => {
        if (!isClient) return;
        // initialize Info instance
        infoRef.current = new Info({ environment });
        return () => {
            // cleanup all subscriptions
            subscriptionsRef.current.forEach((arr) => {
                arr.forEach(({ subscription, id }) => {
                    infoRef.current?.unsubscribe(subscription, id);
                });
            });
            subscriptionsRef.current.clear();
            // terminate all workers
            workers.current.forEach((w) => w.terminate());
            workers.current.clear();
            // disconnect websocket
            infoRef.current?.disconnectWebsocket();
        };
    }, [environment, isClient]);

    const initWorker = (channel: string): Worker => {
        if (workers.current.has(channel)) {
            return workers.current.get(channel)!;
        }
        let worker: Worker;
        if (channel === WsChannels.WEB_DATA2) {
            worker = new Worker(
                new URL(
                    '../processors/workers/webdata2.worker.ts',
                    import.meta.url,
                ),
                { type: 'module' },
            );
        } else {
            worker = new Worker(
                new URL(
                    '../processors/workers/default.worker.ts',
                    import.meta.url,
                ),
                { type: 'module' },
            );
        }
        worker.onmessage = (event) => {
            const subs = subscriptionsRef.current.get(channel);
            subs?.forEach(({ config }) => {
                try {
                    config.handler(event.data);
                } catch (error) {
                    console.error('WsObserver handler error', channel, error);
                }
                if (config.single) unsubscribe(channel, config);
            });
        };
        workers.current.set(channel, worker);
        return worker;
    };

    const subscribe = useCallback(
        (key: string, config: WsSubscriptionConfig): number => {
            if (!infoRef.current) return -1;
            const subscription = {
                type: key as any,
                ...(config.payload || {}),
            } as any;
            const callback = (msg: any) => {
                initWorker(key).postMessage(msg);
            };
            const id = infoRef.current.subscribe(subscription, callback);
            const arr = subscriptionsRef.current.get(key) || [];
            arr.push({ config, subscription, id });
            subscriptionsRef.current.set(key, arr);
            return id;
        },
        [],
    );

    const unsubscribeAllByChannel = useCallback((channel: string) => {
        const arr = subscriptionsRef.current.get(channel);
        arr?.forEach(({ subscription, id }) => {
            infoRef.current?.unsubscribe(subscription, id);
        });
        subscriptionsRef.current.delete(channel);
        const worker = workers.current.get(channel);
        if (worker) {
            worker.terminate();
            workers.current.delete(channel);
        }
    }, []);

    const unsubscribe = useCallback(
        (key: string, config: WsSubscriptionConfig) => {
            const arr = subscriptionsRef.current.get(key);
            if (!arr) return;
            const idx = arr.findIndex((item) => item.config === config);
            if (idx === -1) return;
            const { subscription, id } = arr[idx];
            infoRef.current?.unsubscribe(subscription, id);
            arr.splice(idx, 1);
            if (arr.length === 0) {
                subscriptionsRef.current.delete(key);
                const worker = workers.current.get(key);
                if (worker) {
                    worker.terminate();
                    workers.current.delete(key);
                }
            } else {
                subscriptionsRef.current.set(key, arr);
            }
        },
        [],
    );

    const contextValue = useMemo(
        () => ({ subscribe, unsubscribe, unsubscribeAllByChannel }),
        [subscribe, unsubscribe, unsubscribeAllByChannel],
    );

    return (
        <WsObserverContext.Provider value={contextValue}>
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
