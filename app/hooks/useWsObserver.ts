import { useEffect, useRef, useState } from "react";
import { useWebSocketContext } from "~/contexts/WebSocketContext";
import { processOrderBookMessage } from "~/processors/processOrderBook";
import { useOrderBookStore } from "~/stores/OrderBookStore";


export type WsSubscriptionConfig = {
  handler: (payload: any) => void;
  payload?: any;
}


export function useWsObserver() {
  

  const {sendMessage, lastMessage, readyState, enableWsSubscription} = useWebSocketContext(); 

  const {setOrderBook} = useOrderBookStore();

  //   https://chatgpt.com/c/67b5c9ce-e4fc-8011-9f7e-3af5af3810c9
  // const [subscriptions, setSubscriptions] = useState<Map<string, (payload: any)=>void[]>>();




  const subscriptions = useRef<Map<string, WsSubscriptionConfig[]>>(new Map());
  const [, forceUpdate] = useState(0); // Used to force re-render when needed

  
  useEffect(() => {
    console.log('>>> readyState', readyState)
  }, [readyState])

  useEffect(() => {
    
    if(lastMessage) {
      const msg = JSON.parse(lastMessage);
      switch(msg.type) {
        case 'l2Book':
          const {sells, buys} = processOrderBookMessage(msg.data);
          setOrderBook(buys, sells);
          break;
      }
    }

  }, [lastMessage]);

  const subscribe = (key: string, config: WsSubscriptionConfig) => {
    
    // add subscripton in hook
    if (!subscriptions.current.has(key)) {
      subscriptions.current.set(key, []);
    }
    subscriptions.current.get(key)!.push(config);

    // add subscription through websocket context
    enableWsSubscription(key, config.payload || {});
  };

  const unsubscribe = (key: string, config: WsSubscriptionConfig) => {
    if (subscriptions.current.has(key)) {
      const configs = subscriptions.current.get(key)!.filter((c) => c !== config);
      if (configs.length === 0) {
        subscriptions.current.delete(key);
      } else {
        subscriptions.current.set(key, configs);
      }
    }
  };

  return { subscribe, unsubscribe};
}
