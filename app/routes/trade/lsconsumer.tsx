import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useIsClient } from "~/hooks/useIsClient";
import { useWsObserver, WsChannels } from "~/hooks/useWsObserver";
import { useDebugStore } from "~/stores/DebugStore";
import { useTradeDataStore } from "~/stores/TradeDataStore";
import { getLS } from "~/utils/AppUtils";


const LS_KEY_FAV_COINS = 'favorite-coins';

export default function LsConsumer() {

    const { favKeys, setFavKeys } = useTradeDataStore();

    const isClient = useIsClient();

    const readFavCoins = useCallback(() => {
        const lsVal = localStorage.getItem(LS_KEY_FAV_COINS);
        if (lsVal !== null) {
            const favs = JSON.parse(lsVal);
            setFavKeys(favs);
        } else {
            setFavKeys(['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'LINK']);
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            readFavCoins();
        }
    }, [isClient]);

    return (
        <></>
    )

}


