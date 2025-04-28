import { useCallback, useEffect, useRef, useState } from 'react';
import { useInfoApi } from '~/hooks/useInfoApi';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useSdk } from '~/hooks/useSdk';
import { useWorker } from '~/hooks/useWorker';
import type { WebData2Output } from '~/hooks/workers/webdata2.worker';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { TokenDetailsIF, TokenMetaIF } from '~/utils/ApiIFs';
import { WsChannels } from '~/utils/Constants';
import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';
import type { PositionIF } from '~/utils/position/PositionIFs';
import type { SymbolInfoIF } from '~/utils/SymbolInfoIFs';
import type { UserBalanceIF } from '~/utils/UserDataIFs';

export default function WebDataConsumer() {
    const {
        favKeys,
        setFavCoins,
        setUserOrders,
        symbol,
        setCoins,
        coins,
        setPositions,
        positions,
        setUserBalances,
        userBalances,
        setCoinPriceMap,
    } = useTradeDataStore();
    const symbolRef = useRef<string>(symbol);
    symbolRef.current = symbol;
    const favKeysRef = useRef<string[]>(null);
    favKeysRef.current = favKeys;

    const { debugWallet } = useDebugStore();
    const addressRef = useRef<string>(null);
    addressRef.current = debugWallet.address.toLowerCase();
    const { setSymbolInfo } = useTradeDataStore();

    const openOrdersRef = useRef<OrderDataIF[]>([]);
    const positionsRef = useRef<PositionIF[]>([]);
    const userBalancesRef = useRef<UserBalanceIF[]>([]);

    const { info } = useSdk();
    const { fetchData } = useInfoApi();

    const { formatNum } = useNumFormatter();

    useEffect(() => {
        const foundCoin = coins.find((coin) => coin.coin === symbol);
        if (foundCoin) {
            setSymbolInfo(foundCoin);
        }
    }, [symbol, coins]);

    useEffect(() => {
        if (!info) return;

        setUserOrders([]);
        openOrdersRef.current = [];

        const { unsubscribe } = info.subscribe(
            { type: WsChannels.WEB_DATA2, user: debugWallet.address },
            postWebData2,
        );

        const userDataInterval = setInterval(() => {
            setUserOrders(openOrdersRef.current);
            setPositions(positionsRef.current);
            setUserBalances(userBalancesRef.current);
        }, 1000);

        return () => {
            clearInterval(userDataInterval);
            unsubscribe();
        };
    }, [debugWallet.address, info]);

    const handleWebData2WorkerResult = useCallback(
        ({ data }: { data: WebData2Output }) => {
            setCoins(data.data.coins);
            setCoinPriceMap(data.data.coinPriceMap);
            if (data.data.user.toLowerCase() === addressRef.current) {
                openOrdersRef.current = data.data.userOpenOrders;
                positionsRef.current = data.data.positions;
                userBalancesRef.current = data.data.userBalances;
            }
        },
        [setCoins, setCoinPriceMap],
    );

    const postWebData2 = useWorker<WebData2Output>(
        'webData2',
        handleWebData2WorkerResult,
    );

    useEffect(() => {
        if (favKeysRef.current && coins.length > 0) {
            const favs: SymbolInfoIF[] = [];
            favKeysRef.current.forEach((coin) => {
                const c = coins.find((c) => c.coin === coin);
                if (c) {
                    favs.push(c);
                }
            });
            setFavCoins(favs);
        }
    }, [favKeys, coins]);

    return <></>;
}
