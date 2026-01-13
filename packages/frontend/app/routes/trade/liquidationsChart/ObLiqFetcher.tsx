import type {
    L2BookData,
    LiqLevelMessage,
} from '@perps-app/sdk/src/utils/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWs } from '~/contexts/WsContext';
import { useRestPoller } from '~/hooks/useRestPoller';
import { processOrderBookMessage } from '~/processors/processOrderBook';
import { useLiqChartStore } from '~/stores/LiqChartStore';
import { useOrderBookStore } from '~/stores/OrderBookStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type {
    OrderBookRowIF,
    OrderRowResolutionIF,
} from '~/utils/orderbook/OrderBookIFs';
import {
    createRandomOrderBookLiq,
    getResolutionListForSymbol,
    interpolateOrderBookData,
} from '~/utils/orderbook/OrderBookUtils';
import type { SymbolInfoIF } from '~/utils/SymbolInfoIFs';

interface OBLiqFetcherProps {}

const OBLiqFetcher: React.FC<OBLiqFetcherProps> = () => {
    const { subscribeToPoller, unsubscribeFromPoller } = useRestPoller();
    const { subscribe, unsubscribe } = useWs();

    const { maxLiqValue, minLiqValue, setMaxLiqValue, setMinLiqValue } =
        useLiqChartStore();

    const { symbol, symbolInfo } = useTradeDataStore();
    const symbolRef = useRef<string>('');
    symbolRef.current = symbol;
    const symbolInfoRef = useRef<SymbolInfoIF | null>(null);
    symbolInfoRef.current = symbolInfo;

    const { setHrBuys, setHrSells, setHrLiqBuys, setHrLiqSells } =
        useOrderBookStore();
    const buysRef = useRef<OrderBookRowIF[]>([]);
    const sellsRef = useRef<OrderBookRowIF[]>([]);

    const [maxResolution, setMaxResolution] =
        useState<OrderRowResolutionIF | null>(null);

    // Subscribe to liquidationLevels from ember2 endpoint
    useEffect(() => {
        const config = {
            handler: handleLiquidationLevels,
            payload: { marketId: 64 },
        };

        subscribe('liquidationLevels', config);

        return () => {
            unsubscribe('liquidationLevels', config);
        };
    }, [subscribe, unsubscribe]);

    const handleLiquidationLevels = useCallback((data: LiqLevelMessage) => {
        const levels = data.market.aggregated.levels;
        console.log('>>>>> liquidationLevels levels:', levels);
    }, []);

    useEffect(() => {
        if (!symbol || !symbolInfo?.markPx) return;

        const resolutionList = getResolutionListForSymbol(symbolInfo);
        setMaxResolution(resolutionList[resolutionList.length - 1]);
    }, [symbol, symbolInfo?.markPx]);

    useEffect(() => {
        if (!maxResolution) return;

        const subKey = {
            type: 'l2Book' as const,
            coin: symbolRef.current,
            ...(maxResolution.nsigfigs
                ? { nSigFigs: maxResolution.nsigfigs }
                : {}),
            ...(maxResolution.mantissa
                ? { mantissa: maxResolution.mantissa }
                : {}),
        };

        subscribeToPoller(
            'info',
            subKey,
            (l2BookData: L2BookData) => {
                const { buys, sells } = processOrderBookMessage(l2BookData);
                buysRef.current = buys;
                sellsRef.current = sells;
            },
            3000,
            true,
        );

        return () => {
            unsubscribeFromPoller('info', subKey);
        };
    }, [JSON.stringify(maxResolution)]);

    const genRandomData = useCallback(() => {
        if (buysRef.current.length === 0 || sellsRef.current.length === 0)
            return;
        const hrBuys = interpolateOrderBookData(
            buysRef.current,
            sellsRef.current[0].px,
        );
        const hrSells = interpolateOrderBookData(
            sellsRef.current,
            buysRef.current[0].px,
        );
        hrBuys.push({ ...hrBuys[hrBuys.length - 1], px: 0 });
        hrSells.push({
            ...hrSells[hrSells.length - 1],
            px: hrSells[hrSells.length - 1].px * 100,
        });
        setHrBuys(hrBuys);
        setHrSells(hrSells);

        const { liqBuys, liqSells } = createRandomOrderBookLiq(
            buysRef.current,
            sellsRef.current,
        );
        setHrLiqBuys(liqBuys);
        setHrLiqSells(liqSells.reverse());

        if (maxLiqValue === null) {
            let maxLiq = 0;
            [...liqBuys, ...liqSells].forEach((liq) => {
                if (liq.sz > maxLiq) {
                    maxLiq = liq.sz;
                }
            });
            setMaxLiqValue(maxLiq * (symbolInfoRef.current?.markPx ?? 0));
        }

        if (minLiqValue === null) {
            let minLiq = Infinity;
            [...liqBuys, ...liqSells].forEach((liq) => {
                if (liq.sz < minLiq) {
                    minLiq = liq.sz;
                }
            });
            setMinLiqValue(minLiq * (symbolInfoRef.current?.markPx ?? 0));
        }
    }, [
        setHrBuys,
        setHrSells,
        setHrLiqBuys,
        setHrLiqSells,
        maxLiqValue,
        minLiqValue,
    ]);

    useEffect(() => {
        genRandomData();
        const randomDataInterval = setInterval(() => {
            genRandomData();
        }, 1000);
        return () => clearInterval(randomDataInterval);
    }, [genRandomData]);

    return <></>;
};

export default OBLiqFetcher;
