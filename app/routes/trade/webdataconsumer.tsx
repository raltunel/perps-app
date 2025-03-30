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

    const { favKeys, setFavCoins, setUserOrders } = useTradeDataStore();
    const favKeysRef = useRef<string[]>(null);
    favKeysRef.current = favKeys;


    const { subscribe, unsubscribeAllByChannel } = useWsObserver();
    const { debugWallet } = useDebugStore();
    const addressRef = useRef<string>(null);
    addressRef.current = debugWallet.address;
    const { setSymbolInfo } = useTradeDataStore();

    useEffect(() => {

        subscribe(WsChannels.WEB_DATA2, {
            payload: { user: debugWallet.address },
            handler: (payload) => {
                processWebData2Message(payload);
            },
            single: true
        })

        return () => {
            unsubscribeAllByChannel(WsChannels.WEB_DATA2);
        }
    }, [debugWallet.address])



    const processFavs = useCallback((payload: any) => {

        const newFavCoins: SymbolInfoIF[] = [];

        if (favKeysRef.current) {

            favKeysRef.current.map((coin) => {
                const indexOfCoin = payload.meta.universe.findIndex(
                    (item: any) => item.name === coin,
                );
                if (indexOfCoin !== undefined) {
                    const ctxVal = payload.assetCtxs[indexOfCoin];

                    const coinObject = processSymbolInfo({
                        coin,
                        ctx: ctxVal,
                    });
                    newFavCoins.push(coinObject);
                }
            });

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
            setUserOrders(userOrders);
        } else {
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


