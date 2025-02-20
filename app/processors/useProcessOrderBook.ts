

import { useEffect, useState } from "react";
import { useWebSocketContext } from "~/contexts/WebSocketContext";

export function useProcessOrderBook() {
  const [isClient, setIsClient] = useState(false);

//   const {sendMessage, lastMessage, readyState, subscribe} = useWebSocketContext(); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  return useProcessOrderBook;
}
