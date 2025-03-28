import React,{ createContext, useContext, useEffect, useRef, useState } from "react";
import { useIsClient } from "./useIsClient";


export type WsSubscriptionConfig = {
  handler: (payload: any) => void;
  payload?: any;
  single?: boolean;
}

enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

type WsObserverContextType = {
  subscribe: (key: string, config: WsSubscriptionConfig) => void;
  unsubscribe: (key: string, config: WsSubscriptionConfig) => void;
  unsubscribeAllByChannel: (channel: string) => void;
};


export enum WsChannels {
  ORDERBOOK = 'l2Book',
  ORDERBOOK_TRADES = 'trades',
  USER_FILLS = 'userFills',
  USER_HISTORICAL_ORDERS = 'userHistoricalOrders',
  COINS = 'webData2',
  ACTIVE_COIN_DATA = 'activeAssetCtx',
  NOTIFICATION = 'notification',
  CANDLE = 'candle',
}


const WsObserverContext = createContext<WsObserverContextType | undefined>(undefined);


export const WsObserverProvider: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => {
  const isClient = useIsClient();
  const [readyState, setReadyState] = useState<number>(WebSocketReadyState.CLOSED);
  const socketRef = useRef<WebSocket | null>(null);
  const subscriptions = useRef<Map<string, WsSubscriptionConfig[]>>(new Map());

  const connectWebSocket = () => { 

    if (!isClient) return; // ✅ Ensure WebSocket only runs on client side

    // Close the previous WebSocket if it exists
    if (socketRef.current) {
      socketRef.current.close();
    }

      // Create a new WebSocket connection
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        setReadyState(WebSocketReadyState.OPEN);
      };

      socket.onmessage = (event) => {
        if(event.data){
          const msg = JSON.parse(event.data);

          if(subscriptions.current.has(msg.channel)){
            subscriptions.current.get(msg.channel)?.forEach(config => {
              config.handler(msg.data);
            });
          }
        }
      };

    socket.onclose = () => {
      console.log('>>> socket closed');
      setReadyState(WebSocketReadyState.CLOSED);
    };

    socket.onerror = (error) => {
      console.error('>>> WebSocket error:', error);
      socket.close();
    };
  };

  useEffect(() => {
    if (isClient) {
      connectWebSocket();
    }

    return () => {
      socketRef.current?.close();
    };
  }, [url, isClient]); // ✅ Only runs when client-side is ready

  const sendMessage = (msg: string) => {
    if (socketRef.current?.readyState === WebSocketReadyState.OPEN) {
      socketRef.current.send(msg);
    }
  };

  const registerWsSubscription = (
    type: string,
    payload: any,
    unsubscribe: boolean = false
  ) => {
    sendMessage(
      JSON.stringify({
        method: unsubscribe ? 'unsubscribe' : 'subscribe',
        subscription: {
          type: type,
          ...payload,
        },
      })
    );
  };

  const [, forceUpdate] = useState(0); // Used to force re-render when needed

  useEffect(() => {
    if(readyState === 1){
      subscriptions.current.forEach((configs, key) => { 
        configs.forEach(config => {
          registerWsSubscription(key, config.payload || {});
        });
      });
    }
  }, [readyState])


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
          found = true;
          return;
        }
      });
      if(found) return;
    }
    if(config.single){
      const currentSubs = subscriptions.current.get(key) || [];
      currentSubs.forEach(sub => {
        registerWsSubscription(key, sub.payload || {}, true);
      });
      subscriptions.current.set(key, [config]);
    }
    else{
      subscriptions.current.get(key)!.push(config);
    }

  // add subscription through websocket context
  registerWsSubscription(key, config.payload || {});
};

  // unsubscribe all subscriptions by channel
  const unsubscribeAllByChannel = (channel: string) => {
    if(subscriptions.current.has(channel)){
      subscriptions.current.get(channel)!.forEach(config => {
        registerWsSubscription(channel, config.payload || {}, true);
      });
    }
  }


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

  
return (
  <WsObserverContext.Provider
    value={{ subscribe, unsubscribe, unsubscribeAllByChannel }}>
    {children}
  </WsObserverContext.Provider>
);
}


export const useWsObserver = () => {
  const context = useContext(WsObserverContext);
  if (!context) {
    throw new Error("useWsObserver must be used within a WsObserverProvider");
  }
  return context;
};
