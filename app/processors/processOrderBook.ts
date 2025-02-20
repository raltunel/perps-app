import type { OrderRowIF } from "~/routes/trade/orderbook/orderbook";





export function processOrderBookMessage(payload: any): {sells: OrderRowIF[], buys: OrderRowIF[]} {
  


  return {sells: [], buys: []}
} 
