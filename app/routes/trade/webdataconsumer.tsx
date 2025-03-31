import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useWsObserver, WsChannels } from "~/hooks/useWsObserver";
import { processUserOrder } from "~/processors/processOrderBook";
import { processSymbolInfo } from "~/processors/processSymbolInfo";
import { useDebugStore } from "~/stores/DebugStore";
import { useTradeDataStore } from "~/stores/TradeDataStore";
import type { OrderDataIF } from "~/utils/orderbook/OrderBookIFs";
import type { SymbolInfoIF } from "~/utils/SymbolInfoIFs";


export default function WebDataConsumer() {

    const { favKeys, setFavCoins, setUserOrders, symbol } = useTradeDataStore();
    const symbolRef = useRef<string>(symbol);
    symbolRef.current = symbol;
    const favKeysRef = useRef<string[]>(null);
    favKeysRef.current = favKeys;


    const { subscribe, unsubscribeAllByChannel } = useWsObserver();
    const { debugWallet } = useDebugStore();
    const addressRef = useRef<string>(null);
    addressRef.current = debugWallet.address;
    const { setSymbolInfo } = useTradeDataStore();

    const openOrdersRef = useRef<OrderDataIF[]>([]);

    useEffect(() => {

        subscribe(WsChannels.WEB_DATA2, {
            payload: { user: debugWallet.address },
            handler: (payload) => {
                processWebData2Message(payload);
            },
            single: true
        })

        const openOrdersInterval = setInterval(() => {
            setUserOrders(openOrdersRef.current);
        }, 300);

        return () => {
            clearInterval(openOrdersInterval);
            unsubscribeAllByChannel(WsChannels.WEB_DATA2);
        }
    }, [debugWallet.address])



    const getCoinCtx = useCallback((payload: any, coin: string) => {
        if (payload && payload.assetCtxs && payload.meta.universe) {
            const indexOfCoin = payload.meta.universe.findIndex(
                (item: any) => item.name === coin,
            );
            return payload.assetCtxs[indexOfCoin];
        }
        return null;
    }, []);

    const processFavs = useCallback((payload: any) => {

        const newFavCoins: SymbolInfoIF[] = [];
        let currentSymbolFound = false;

        if (favKeysRef.current) {
            favKeysRef.current.map((coin) => {

                const ctxVal = getCoinCtx(payload, coin);

                if (ctxVal !== null) {
                    const coinObject = processSymbolInfo({
                        coin,
                        ctx: ctxVal,
                    });
                    newFavCoins.push(coinObject);
                    if (coin === symbolRef.current) {
                        setSymbolInfo(coinObject);
                        currentSymbolFound = true;
                    }
                }

            });
        }

        if (!currentSymbolFound) {
            const currentSymbolCtx = getCoinCtx(payload, symbolRef.current);
            if (currentSymbolCtx !== null) {
                const coinObject = processSymbolInfo({
                    coin: symbolRef.current,
                    ctx: currentSymbolCtx,
                });
                setSymbolInfo(coinObject);
            }
        }

        setFavCoins([...newFavCoins]);
    }, []);

    const processOpenOrders = useCallback((orders: any) => {
        if (orders && orders.length > 0) {
            const userOrders: OrderDataIF[] = [];
            orders.map((order: any) => {
                const processedOrder = processUserOrder(order, 'open');
                if (processedOrder) {
                    userOrders.push(processedOrder);
                }
            })
            openOrdersRef.current = userOrders;
        } else {
            openOrdersRef.current = [];
            setUserOrders([]);
        }
    }, []);

    const processWebData2Message = useCallback((payload: any) => {

        if (
            payload &&
            payload.meta &&
            payload.meta.universe &&
            payload.assetCtxs
        ) {
            processFavs(payload);


            // process account related data
            if (addressRef.current === payload.user) {
                processOpenOrders(payload.openOrders);
            } else {
                setUserOrders([]);
            }
        }
    }, []);


    return (
        <></>
    )

}


