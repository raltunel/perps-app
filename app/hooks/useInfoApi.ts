import { useEffect, useRef, useState } from "react";
import { useWebSocketContext } from "~/contexts/WebSocketContext";
import { processOrderBookMessage } from "~/processors/processOrderBook";
import { useOrderBookStore } from "~/stores/OrderBookStore";


export type ApiCallConfig = {
  type: string;
  handler: (data: any) => void;
  payload?: any;
}

const apiUrl = 'https://api-ui.hyperliquid.xyz/info';


export function useInfoApi() {

  const fetchInfo = async (config: ApiCallConfig) => {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({type: config.type, ...config.payload}),
    });
    const data = await response.json();
    config.handler(data);
  }

  return { fetchInfo};
}
