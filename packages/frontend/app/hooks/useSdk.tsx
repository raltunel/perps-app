import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { useIsClient } from './useIsClient';
import { Info, Exchange, type Environment, DEMO_USER } from '@perps-app/sdk';
import type { WsSubscriptionConfig } from './useWsObserver';
import { useWorkerAgenda } from './useWorkerAgenda';

type SdkContextType = {
    info: Info | null;
    exchange: Exchange | null;
    subscribe: (channel: string, config: WsSubscriptionConfig) => void;
};

const SdkContext = createContext<SdkContextType | undefined>(undefined);

type SdkSubscription = {
    channel: string;
    config: WsSubscriptionConfig;
    subscriptionId: number;
};

export const SdkProvider: React.FC<{
    environment: Environment;
    children: React.ReactNode;
}> = ({ environment, children }) => {
    const isClient = useIsClient();
    const info = useRef<Info | null>(null);
    const exchange = useRef<Exchange | null>(null);

    const { checkCustomWorker } = useWorkerAgenda();

    const pendingSubscriptions = useRef<Record<string, WsSubscriptionConfig>>(
        {},
    );

    const activeSubscriptions = useRef<Record<string, SdkSubscription[]>>({});

    useEffect(() => {
        if (!isClient) return;
        if (!info.current) {
            info.current = new Info({
                environment,
                skipWs: false,
                // isDebug: true, // TODO: remove in prod
            });
        } else {
            info.current.setEnvironment(environment);
        }
        if (!exchange.current) {
            exchange.current = new Exchange(
                {},
                {
                    environment,
                    accountAddress: DEMO_USER,
                    // isDebug: true, // TODO: remove in prod
                },
            );
        } else {
            exchange.current.setEnvironment(environment);
        }
    }, [isClient, environment]);

    const subscribe = (channel: string, config: WsSubscriptionConfig) => {
        if (!info.current) {
            pendingSubscriptions.current[channel] = config;
            return;
        }

        handleCustomWorker(channel);
        handleSingleSubscription(channel, config);

        const subscriptionId = info.current.subscribe(
            {
                type: channel,
                ...config.payload,
            },
            config.handler,
        );

        saveActiveSubscription(channel, config, subscriptionId);
    };

    const handleCustomWorker = useCallback((channel: string) => {
        const worker = checkCustomWorker(channel);
        if (worker && info.current?.wsManager) {
            info.current.wsManager.registerWorker(channel, worker);
        }
    }, []);

    const saveActiveSubscription = useCallback(
        (
            channel: string,
            config: WsSubscriptionConfig,
            subscriptionId: number,
        ) => {
            if (!activeSubscriptions.current[channel]) {
                activeSubscriptions.current[channel] = [];
            }
            activeSubscriptions.current[channel].push({
                channel,
                config,
                subscriptionId,
            });
        },
        [],
    );

    const handleSingleSubscription = useCallback(
        (channel: string, config: WsSubscriptionConfig) => {
            if (
                config.single &&
                info.current &&
                activeSubscriptions.current[channel]
            ) {
                activeSubscriptions.current[channel].forEach((sub) => {
                    info.current?.unsubscribe(
                        { type: sub.channel, ...sub.config.payload },
                        sub.subscriptionId,
                    );
                });
                activeSubscriptions.current[channel] = [];
            }
        },
        [],
    );

    useEffect(() => {
        if (!info.current) return;
        Object.entries(pendingSubscriptions.current).forEach(
            ([channel, config]) => {
                subscribe(channel, config);
            },
        );
        pendingSubscriptions.current = {};
    }, [info.current]);

    return (
        <SdkContext.Provider
            value={{
                info: info.current,
                exchange: exchange.current,
                subscribe,
            }}
        >
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
