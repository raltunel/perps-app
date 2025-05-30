import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { getLS } from '~/utils/AppUtils';
import { WsChannels } from '~/utils/Constants';

export default function TradeRouteHandler() {
    const { marketId } = useParams<{ marketId: string }>(); // Get marketId from URL

    const { setSymbol } = useTradeDataStore();
    const navigate = useNavigate();

    const getSymbolFromLS = () => {
        const activeSymbol = getLS('activeCoin');
        if (activeSymbol) {
            setSymbol(activeSymbol);
        } else {
            setSymbol('BTC');
        }
    };

    const checkSymbol = async () => {
        const urlSymbol = marketId;

        if (urlSymbol === undefined || urlSymbol === null || urlSymbol === '') {
            return getSymbolFromLS();
        } else {
            const response = await fetch(`https://api.hyperliquid.xyz/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: WsChannels.ORDERBOOK,
                    coin: urlSymbol,
                }),
            });

            const data = await response.json();
            if (data && data.levels) {
                setSymbol(urlSymbol);
            } else {
                setSymbol('BTC');
                navigate('/trade/BTC', { viewTransition: true });
            }
        }
    };

    useEffect(() => {
        checkSymbol();
    }, [marketId]);

    return <></>;
}
