import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { useIsClient } from './useIsClient';
import { Info, Exchange, type Environment, DEMO_USER } from '@perps-app/sdk';

import webData2Worker from './workers/webdata2.worker.ts?worker';

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
    const info = useRef<Info | null>(null);
    const exchange = useRef<Exchange | null>(null);

    const createCustomWorkers = useCallback(() => {
        return {
            webData2: new webData2Worker(),
        };
    }, []);

    useEffect(() => {
        if (!isClient) return;
        if (!info.current) {
            info.current = new Info({
                environment,
                skipWs: false,
                numWorkers: 2,
                customWorkers: createCustomWorkers(),
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
                    customWorkers: createCustomWorkers(),
                },
            );
        } else {
            exchange.current.setEnvironment(environment);
        }
    }, [isClient, environment]);

    return (
        <SdkContext.Provider
            value={{ info: info.current, exchange: exchange.current }}
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
