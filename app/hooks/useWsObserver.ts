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
    if(readyState === 1){
      subscriptions.current.forEach((configs, key) => { 
        configs.forEach(config => {
          enableWsSubscription(key, config.payload || {});
        });
      });
    }
  }, [readyState])

  useEffect(() => {
    if(lastMessage) {
      const msg = JSON.parse(lastMessage);
      if(subscriptions.current.has(msg.channel)){
        subscriptions.current.get(msg.channel)?.forEach(config => {
          config.handler(msg.data);
        });
      }
    }

  }, [lastMessage]);

  const subscribe = (key: string, config: WsSubscriptionConfig) => {
    // add subscripton in hook
    if (!subscriptions.current.has(key)) {
      subscriptions.current.set(key, []);
    }
    else{
      const subs = subscriptions.current.get(key)!;
      let found = false;
      subs.forEach(sub => {
        if(JSON.stringify(sub.payload) === JSON.stringify(config.payload) ){
          console.log('>>> already subscribed');
          found = true;
          return;
        }
      });
      if(found) return;
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
