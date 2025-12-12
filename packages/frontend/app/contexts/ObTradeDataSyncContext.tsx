import { useSession } from '@fogo/sessions-sdk-react';
import type { L2BookData } from '@perps-app/sdk/src/utils/types';
import React, {
    createContext,
    useContext,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react';
import { useEffect } from 'react';
import { useRestPoller } from '~/hooks/useRestPoller';
import { processOrderBookMessage } from '~/processors/processOrderBook';
import { useOrderBookStore } from '~/stores/OrderBookStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';

interface ObTradeDataSyncContextType {}

export const ObTradeDataSyncContext = createContext<ObTradeDataSyncContextType>(
    {},
);

export interface ObTradeDataSyncProviderProps {
    children: React.ReactNode;
}

export const ObTradeDataSyncProvider: React.FC<
    ObTradeDataSyncProviderProps
> = ({ children }) => {
    const { symbol, symbolInfo, isMidModeActive, setOrderInputPriceValue } =
        useTradeDataStore();
    const { subscribeToPoller, unsubscribeFromPoller } = useRestPoller();
    const { setMidPrice, midPrice } = useOrderBookStore();

    useEffect(() => {
        if (!symbol) return;
        subscribeToPoller(
            'info',
            {
                type: 'l2Book' as const,
                coin: symbol,
            },
            (data: L2BookData) => {
                const { buys, sells } = processOrderBookMessage(data);
                setMidPrice((buys[0].px + sells[0].px) / 2);
            },
            3000,
            true,
        );

        return () => {
            unsubscribeFromPoller('info', {
                type: 'l2Book' as const,
                coin: symbol,
            });
        };
    }, [symbol]);

    useEffect(() => {
        if (!symbolInfo?.markPx) return;
        setMidPrice(symbolInfo.markPx);
    }, [symbolInfo?.markPx]);

    useEffect(() => {
        if (!isMidModeActive) return;
        if (!midPrice) return;
        setOrderInputPriceValue({
            value: midPrice,
            changeType: 'midPriceChange',
        });
    }, [isMidModeActive, midPrice]);

    return (
        <ObTradeDataSyncContext.Provider value={{}}>
            {children}
        </ObTradeDataSyncContext.Provider>
    );
};

export const useObTradeDataSync = () => useContext(ObTradeDataSyncContext);
