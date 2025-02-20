import { useEffect, useState } from "react";
import { useWebSocketContext } from "~/contexts/WebSocketContext";

export function useWsObserver() {
  

  const {sendMessage, lastMessage, readyState, addSubscription} = useWebSocketContext(); 

  //   https://chatgpt.com/c/67b5c9ce-e4fc-8011-9f7e-3af5af3810c9
  const [subscriptions, setSubscriptions] = useState<Map<string, (payload: any)=>void[]>>();
  

  const subscribe = (msg: string, handler: (payload: any) => void) => {

    // setSubscriptions([...subscriptions, {msg, handler}]);

  }

  const unsubscribe = (msg: string) => {
    
  }


  return ;
}
