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

export type WsSubscriptionConfig = {
    handler: (payload: any) => void;
    payload?: any;
    single?: boolean;
    subscriptionId?: number;
};

enum WebSocketReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

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
    const socketManagerRef = useRef<WebsocketManager | null>(null);
    const isClient = useIsClient();
    const [readyState, setReadyState] = useState<number>(
        WebSocketReadyState.CLOSED,
    );
    const readyStateRef = useRef<number>(WebSocketReadyState.CLOSED);
    readyStateRef.current = readyState;
    const workers = useRef<Map<string, Worker>>(new Map());
    const socketRef = useRef<WebSocket | null>(null);
    const subscriptions = useRef<Map<string, WsSubscriptionConfig[]>>(
        new Map(),
    );

    const { isWsEnabled } = useDebugStore();

    const { sdkEnabled } = useDebugStore();
    const sdkEnabledRef = useRef(sdkEnabled);
    sdkEnabledRef.current = sdkEnabled;

    const [sdkReady, setSdkReady] = useState(
        socketManagerRef.current?.isWsReady(),
    );

    function extractChannelFromPayload(raw: string): string {
        const match = raw.match(/"channel"\s*:\s*"([^"]+)"/);
        return match ? match[1] : '';
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (sdkReady !== socketManagerRef.current?.isWsReady()) {
                setSdkReady(socketManagerRef.current?.isWsReady());
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const connectWebSocket = () => {
        if (!isClient) {
            return;
        } // ✅ Ensure WebSocket only runs on client side

        // Close the previous WebSocket if it exists
        if (socketRef.current) {
            socketRef.current.close();
        }

        // Create a new WebSocket connection
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            setReadyState(WebSocketReadyState.OPEN);
        };

        socket.onmessage = (event) => {
            if (event.data) {
                const channel = extractChannelFromPayload(event.data);
                const worker = getWorker(channel);
                if (worker) {
                    worker.postMessage(event.data);
                }

                // const sub = subscriptions.current.get(channel);
                // if(sub){
                //   if()
                //   subscriptions.current.get(channel)?.forEach(config => {
                //     config.handler(event.data);
                //   });
                // }

                // const msg = JSON.parse(event.data);

                // if (subscriptions.current.has(msg.channel)) {
                //   subscriptions.current.get(msg.channel)?.forEach(config => {
                //     config.handler(msg.data);
                //   });
                // }
            }
        };

        socket.onclose = () => {
            setReadyState(WebSocketReadyState.CLOSED);
        };

        socket.onerror = (error) => {
            socket.close();
        };
    };
    const sdkOnMessage = (data: string) => {
        const channel = extractChannelFromPayload(data);
        const worker = getWorker(channel);
        if (worker) {
            worker.postMessage(data);
        }
    };

    const initSdkClient = () => {
        if (socketManagerRef.current) {
            socketManagerRef.current.stop();
        }
        const info = new Info({
            environment: wsEnvironment as Environment,
        });
        if (info) {
            socketManagerRef.current = info.wsManager;
        }
    };

    useEffect(() => {
        if (isClient && !sdkEnabledRef.current) {
            if (isWsEnabled) {
                connectWebSocket();
            } else if (socketRef.current) {
                socketRef.current.close();
            }
        }

        return () => {
            // console.log('>>> socket closed!!!!!!!!!!!!!');
            // socketRef.current?.close();
        };
    }, [url, isClient, sdkEnabled, isWsEnabled]); // ✅ Only runs when client-side is ready

    useEffect(() => {
        if (isClient && sdkEnabledRef.current) {
            if (isWsEnabled) {
                initSdkClient();
            } else {
                if (socketManagerRef.current) {
                    socketManagerRef.current.stop();
                }
            }
        }
    }, [wsEnvironment, isClient, sdkEnabled, isWsEnabled]);

    useEffect(() => {
        if (sdkEnabled === false) {
            if (socketManagerRef.current) {
                socketManagerRef.current.stop();
            }
        } else {
            if (socketRef.current) {
                socketRef.current.close();
            }
        }
    }, [sdkEnabled]);

    const sendMessage = (msg: string) => {
        if (socketRef.current?.readyState === WebSocketReadyState.OPEN) {
            socketRef.current.send(msg);
        }
    };

    const wsSubscribe = (type: string, payload: any): number | undefined => {
        if (sdkEnabledRef.current) {
            if (
                socketManagerRef.current &&
                socketManagerRef.current.isWsReady()
            ) {
                const subscriptionId = socketManagerRef.current.subscribe(
                    {
                        type: type,
                        ...payload,
                    },
                    (msg) => {
                        sdkOnMessage(JSON.stringify(msg));
                    },
                );
                return subscriptionId;
            }
        } else {
            sendMessage(
                JSON.stringify({
                    method: 'subscribe',
                    subscription: {
                        type: type,
                        ...payload,
                    },
                }),
            );
        }
    };

    const wsUnsubscribe = (
        type: string,
        payload: any,
        subscriptionId?: number,
    ) => {
        if (sdkEnabledRef.current) {
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
        } else {
            sendMessage(
                JSON.stringify({
                    method: 'unsubscribe',
                    subscription: { type, ...payload },
                }),
            );
        }
    };

    const [, forceUpdate] = useState(0); // Used to force re-render when needed

    useEffect(() => {
        if (
            readyStateRef.current === WebSocketReadyState.OPEN &&
            sdkEnabledRef.current === false
        ) {
            subscriptions.current.forEach((configs, key) => {
                configs.forEach((config) => {
                    wsSubscribe(key, config.payload || {});
                });
            });
        }
    }, [readyState, sdkEnabledRef.current]);

    useEffect(() => {
        if (
            socketManagerRef.current?.isWsReady() === true &&
            sdkEnabledRef.current === true
        ) {
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
    }, [sdkEnabled, sdkReady]);

    const subscribe = (key: string, config: WsSubscriptionConfig) => {
        initWorker(key);

        // add subscripton in hook
        if (!subscriptions.current.has(key)) {
            subscriptions.current.set(key, []);
        }

        // else{
        //   const subs = subscriptions.current.get(key)!;
        //   let found = false;
        //   subs.forEach(sub => {
        //     if(JSON.stringify(sub.payload) === JSON.stringify(config.payload) ){
        //       found = true;
        //       return;
        //     }
        //   });
        //   if(key === 'webData2'){
        //     console.log('found', found);
        //   }
        //   if(found) return;
        // }

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
            // case WsChannels.WEB_DATA2:
            //     const w1 = new Worker(
            //         new URL(
            //             './../processors/workers/webdata2.worker.ts',
            //             import.meta.url,
            //         ),
            //         { type: 'module' },
            //     );

            //     w1.onmessage = (event) => {
            //         const subs = subscriptions.current.get(event.data.channel);
            //         if (subs) {
            //             subs.forEach((config) => {
            //                 config.handler(event.data);
            //             });
            //         }
            //     };
            //     workers.current.set(type, w1);
            //     return w1;
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
                            config.handler(event.data.data);
                        });
                    }
                };

                workers.current.set(type, w2);
                return w2;
        }
    };

    const getWorker = (type: string) => {
        return workers.current.get(type);
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
