import type { OrderRowIF } from "~/utils/orderbook/OrderBookIFs";
import { parseNum } from "~/utils/orderbook/OrderBookUtils";




export function processOrderBookMessage(data: any, slice?:number): {sells: OrderRowIF[], buys: OrderRowIF[]} {
    const buysRaw = data.levels[0].slice(0, slice || 11);
    const sellsRaw = data.levels[1].slice(0, slice || 11);

    let buyTotal = 0;
    let sellTotal = 0;
    let buysProcessed: OrderRowIF[] = buysRaw.map((e: any) => {
      buyTotal += parseFloat(e.sz);
      return {
        coin: data.coin,
        px: parseNum(e.px),
        sz: parseNum(e.sz),
        n: parseInt(e.n),
        type: 'buy',
        total: parseNum(buyTotal)
      }
    });
    let sellsProcessed: OrderRowIF[] = sellsRaw.map((e: any) => {
      sellTotal += parseFloat(e.sz);
      return {
        coin: data.coin,
        px: parseNum(e.px),
        sz: parseNum(e.sz),
        n: parseInt(e.n),
        type: 'sell',
        total: parseNum(sellTotal)
      }
    });
    const ratioPivot = sellTotal > buyTotal ? sellTotal : buyTotal;
    // const ratioPivot = buyTotal + sellTotal;
    
    buysProcessed = buysProcessed.map((e, index) => {
      e.ratio = e.total / ratioPivot;
      return e;
    });

    sellsProcessed = sellsProcessed.map((e, index) => {
      e.ratio = e.total / ratioPivot;
      return e;
    });

  return {sells: sellsProcessed, buys: buysProcessed}
} 
