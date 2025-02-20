import { useEffect, useRef, useState } from "react";
import { useWebSocketContext } from "~/contexts/WebSocketContext";


export type WsObserverHandler = (payload: any) => void;


export function useWsObserver() {
  

  const {sendMessage, lastMessage, readyState, addSubscription} = useWebSocketContext(); 

  //   https://chatgpt.com/c/67b5c9ce-e4fc-8011-9f7e-3af5af3810c9
  // const [subscriptions, setSubscriptions] = useState<Map<string, (payload: any)=>void[]>>();


  const subscriptions = useRef<Map<string, WsObserverHandler[]>>(new Map());
  const [, forceUpdate] = useState(0); // Used to force re-render when needed

  const subscribe = (key: string, handler: WsObserverHandler, payload?: any) => {
    
    // add subscripton in hook
    if (!subscriptions.current.has(key)) {
      subscriptions.current.set(key, []);
    }
    subscriptions.current.get(key)!.push(handler);

    // add subscription through websocket context
    addSubscription(key, payload);
  };

  const unsubscribe = (key: string, handler: WsObserverHandler) => {
    if (subscriptions.current.has(key)) {
      const handlers = subscriptions.current.get(key)!.filter((h) => h !== handler);
      if (handlers.length === 0) {
        subscriptions.current.delete(key);
      } else {
        subscriptions.current.set(key, handlers);
      }
    }
  };

  const notify = (key: string, payload: any) => {
    if (subscriptions.current.has(key)) {
      subscriptions.current.get(key)!.forEach((handler) => handler(payload));
    } 
  };

  return { subscribe, unsubscribe, notify };
}
