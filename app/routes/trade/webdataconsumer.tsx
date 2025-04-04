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

    const { favKeys, setFavCoins, setUserOrders, symbol, setCoins, coins } = useTradeDataStore();
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

    const last10SecDataLengthRef = useRef<number>(0);

    useEffect(() => {

        const foundCoin = coins.find(coin => coin.coin === symbol);
        if (foundCoin) {
            setSymbolInfo(foundCoin);
        }


    }, [symbol, coins])


    useEffect(() => {
        const interval = setInterval(() => {

            last10SecDataLengthRef.current = 0
        }, 10000);

        return () => {
            clearInterval(interval);
        }
    }, []);




    useEffect(() => {

        setUserOrders([]);
        openOrdersRef.current = [];

        subscribe(WsChannels.WEB_DATA2, {
            payload: { user: debugWallet.address },
            handler: (payload) => {
                setCoins(payload.data.coins);
                if (payload.data.user === addressRef.current) {
                    openOrdersRef.current = payload.data.userOpenOrders;
                }
                last10SecDataLengthRef.current += payload.data.size;
                console.log('>>> last 10 secs', (last10SecDataLengthRef.current / 1024).toFixed(2) + ' KB');
            },
            single: true
        })

        const openOrdersInterval = setInterval(() => {
            setUserOrders(openOrdersRef.current);
        }, 1000);

        return () => {
            clearInterval(openOrdersInterval);
            unsubscribeAllByChannel(WsChannels.WEB_DATA2);
        }
    }, [debugWallet.address])




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

    return (
        <></>
    )

}


