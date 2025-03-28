import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useWsObserver, WsChannels } from "~/hooks/useWsObserver";
import { useTradeDataStore } from "~/stores/TradeDataStore";
import { getLS } from "~/utils/AppUtils";


export default function TradeRouteHandler() {


    const { marketId } = useParams<{ marketId: string }>(); // Get marketId from URL

    const {symbol, setSymbol} = useTradeDataStore();
    const navigate = useNavigate();
    
  const { subscribe } = useWsObserver();

  useEffect(() => {
    console.log('>>> trade route handler');
    const activeSymbol = getLS('activeCoin');
    console.log('>>> activeSymbol', activeSymbol);
    if(activeSymbol){
      setSymbol(activeSymbol);
    } else{
       setSymbol('BTC');
    }
  }, []);

  const checkSymbol = async () => {
    const urlSymbol = marketId?.toUpperCase();

    if(urlSymbol && urlSymbol.length > 0 && urlSymbol !== symbol){
      const response = await fetch(
        `https://api.hyperliquid.xyz/info`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        type: WsChannels.ORDERBOOK,
        coin: urlSymbol
      })});

      if(response && response.ok){
        setSymbol(urlSymbol);
      }else{
        navigate('/trade/BTC');
      }
    }
    }

    
  useEffect(() => {
    checkSymbol();
    marketId && console.log(marketId); // Logs the ticker from the URL
}, [marketId]);



    
    return (
        <></>
    )

}


