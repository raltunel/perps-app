import { isEstablished, useSession } from '@fogo/sessions-sdk-react';
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react';
import { useCallback } from 'react';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useUserDataStore } from '~/stores/UserDataStore';
import { initializePythPriceService } from '~/stores/PythPriceStore';
import { debugWallets } from '~/utils/Constants';
import { useIsClient } from '~/hooks/useIsClient';

interface AppContextType {
    isUserConnected: boolean;
    setIsUserConnected: Dispatch<SetStateAction<boolean>>;
    assignDefaultAddress: () => void;
    subscribe: (key: string, config: WsSubscriptionConfig) => void;
    unsubscribe: (key: string, config: WsSubscriptionConfig) => void;
    unsubscribeAllByChannel: (channel: string) => void;
}

export const AppContext = createContext<AppContextType>({
    isUserConnected: false,
    setIsUserConnected: () => {},
    assignDefaultAddress: () => {},
    subscribe: () => {},
    unsubscribe: () => {},
    unsubscribeAllByChannel: () => {},
});

export interface AppProviderProps {
    children: React.ReactNode;
    url: string;
}

interface WsSubscriptionConfig {
    handler: (payload: any) => void;
    payload?: any;
    single?: boolean;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, url }) => {
    const [isUserConnected, setIsUserConnected] = useState(false);

    const {
        isDebugWalletActive,
        debugWallet,
        setDebugWallet,
        manualAddressEnabled,
        manualAddress,
        setManualAddressEnabled,
        setManualAddress,
    } = useDebugStore();

    const { setUserAddress } = useUserDataStore();

    const { resetUserData } = useTradeDataStore();

    const sessionState = useSession();
    const [fogoAddress, setFogoAddress] = useState('');

    // Initialize Pyth price service on mount
    useEffect(() => {
        initializePythPriceService();
    }, []);

    const bindEmptyAddress = () => {
        if (isDebugWalletActive) {
            setUserAddress(debugWallets[2].address);
        } else {
            setUserAddress('');
        }
        resetUserData();
    };

    const assignDefaultAddress = useCallback(() => {
        if (isDebugWalletActive) {
            if (fogoAddress === '') {
                bindEmptyAddress();
            } else {
                const walletToSet = fogoAddress.match(/^[a-zA-Z]/)
                    ? debugWallets[0]
                    : debugWallets[1];
                setUserAddress(walletToSet.address);
                setDebugWallet(walletToSet);
            }
            setManualAddressEnabled(false);
            setManualAddress('');
        } else {
            if (fogoAddress === '') {
                bindEmptyAddress();
            } else {
                setUserAddress(fogoAddress);
            }
        }
    }, [fogoAddress, isDebugWalletActive]);

    useEffect(() => {
        if (isEstablished(sessionState)) {
            setFogoAddress(sessionState.walletPublicKey.toString());
            assignDefaultAddress();
        } else {
            bindEmptyAddress();
        }
    }, [isEstablished(sessionState)]);

    useEffect(() => {
        assignDefaultAddress();
    }, [isDebugWalletActive, fogoAddress]);

    useEffect(() => {
        if (debugWallet && isDebugWalletActive) {
            setUserAddress(debugWallet.address);
        }
    }, [debugWallet, isDebugWalletActive]);

    useEffect(() => {
        if (
            manualAddressEnabled &&
            manualAddress !== '' &&
            manualAddress !== undefined
        ) {
            setUserAddress(manualAddress);
        } else {
            if (isDebugWalletActive) {
            } else {
                setUserAddress(fogoAddress);
            }
        }
    }, [manualAddressEnabled, manualAddress, isDebugWalletActive]);

    //----------------------------------- ws context

    const isClient = useIsClient();
    const [readyState, setReadyState] = useState<number>(3);
    const readyStateRef = useRef<number>(3);
    readyStateRef.current = readyState;
    const workers = useRef<Map<string, Worker>>(new Map());
    const socketRef = useRef<WebSocket | null>(null);
    const subscriptions = useRef<Map<string, WsSubscriptionConfig[]>>(
        new Map(),
    );

    const { isWsSleepMode } = useDebugStore();
    const sleepModeRef = useRef(isWsSleepMode);
    sleepModeRef.current = isWsSleepMode;

    function extractChannelFromPayload(raw: string): string {
        const match = raw.match(/"channel"\s*:\s*"([^"]+)"/);
        return match ? match[1] : '';
    }

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
            setReadyState(1);
        };

        socket.onmessage = (event) => {
            if (sleepModeRef.current) {
                return;
            }

            if (event.data) {
                const channel = extractChannelFromPayload(event.data);
                // const worker = getWorker(channel);
                // if (worker) {
                //     worker.postMessage(event.data);
                // }

                // const sub = subscriptions.current.get(channel);
                // if(sub){
                //   subscriptions.current.get(channel)?.forEach(config => {
                //     config.handler(event.data);
                //   });
                // }

                const msg = JSON.parse(event.data);

                if (subscriptions.current.has(msg.channel)) {
                    subscriptions.current
                        .get(msg.channel)
                        ?.forEach((config) => {
                            config.handler(msg.data);
                        });
                }
            }
        };

        socket.onclose = () => {
            setReadyState(3);
        };

        socket.onerror = (error) => {
            socket.close();
        };
    };

    useEffect(() => {
        if (isClient) {
            connectWebSocket();
        }

        return () => {
            // console.log('>>> socket closed!!!!!!!!!!!!!');
            // socketRef.current?.close();
        };
    }, [url, isClient]); // ✅ Only runs when client-side is ready

    const sendMessage = (msg: string) => {
        if (socketRef.current?.readyState === 1) {
            socketRef.current.send(msg);
        }
    };

    const registerWsSubscription = (
        type: string,
        payload: any,
        unsubscribe: boolean = false,
    ) => {
        sendMessage(
            JSON.stringify({
                method: unsubscribe ? 'unsubscribe' : 'subscribe',
                subscription: {
                    type: type,
                    ...payload,
                },
            }),
        );
    };

    useEffect(() => {
        if (readyStateRef.current === 1) {
            subscriptions.current.forEach((configs, key) => {
                configs.forEach((config) => {
                    registerWsSubscription(key, config.payload || {});
                });
            });
        }
    }, [readyState]);

    const subscribe = (key: string, config: WsSubscriptionConfig) => {
        // initWorker(key);

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
                registerWsSubscription(key, sub.payload || {}, true);
            });
            subscriptions.current.set(key, [config]);
        } else {
            subscriptions.current.get(key)!.push(config);
        }

        // add subscription through websocket context
        registerWsSubscription(key, config.payload || {});
    };

    // unsubscribe all subscriptions by channel
    const unsubscribeAllByChannel = (channel: string) => {
        if (subscriptions.current.has(channel)) {
            subscriptions.current.get(channel)!.forEach((config) => {
                registerWsSubscription(channel, config.payload || {}, true);
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

    // const initWorker = (type: string) => {
    //     if (!isClient || workers.current.has(type)) {
    //         return;
    //     }

    //     switch (type) {
    //         // case WsChannels.WEB_DATA2:
    //         //     // const w1 = new Worker(
    //         //     //     new URL(
    //         //     //         './../hooks/workers/webdata2.worker.ts',
    //         //     //         import.meta.url,
    //         //     //     ),
    //         //     //     { type: 'module' },
    //         //     // );

    //         //     const w1 = new webData2Worker();

    //         //     w1.onmessage = (event) => {
    //         //         const subs = subscriptions.current.get(event.data.channel);
    //         //         if (subs) {
    //         //             subs.forEach((config) => {
    //         //                 config.handler(event.data);
    //         //             });
    //         //         }
    //         //     };
    //         //     workers.current.set(type, w1);
    //         //     return w1;
    //         default:
    //             console.log('>>>>> default worker');
    //             // const w2 = new defaultWorker();

    //             const w2 = new Worker(
    //                 new URL(
    //                     '~/processors/workers/default.worker.ts',
    //                     import.meta.url,
    //                 ),
    //                 // { type: 'module' },
    //             );

    //             // const w2 = new jsonParserWorker();

    //             w2.onmessage = (event) => {
    //                 const subs = subscriptions.current.get(event.data.channel);
    //                 if (subs) {
    //                     subs.forEach((config) => {
    //                         config.handler(event.data.data);
    //                     });
    //                 }
    //             };

    //             workers.current.set(type, w2);
    //             return w2;
    //     }
    // };

    const getWorker = (type: string) => {
        return workers.current.get(type);
    };

    return (
        <AppContext.Provider
            value={{
                isUserConnected,
                setIsUserConnected,
                assignDefaultAddress,
                subscribe,
                unsubscribe,
                unsubscribeAllByChannel,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
