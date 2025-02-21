import type { OrderRowIF } from "~/routes/trade/orderbook/orderbook";




const formatNum = (val : string | number) => {
  return parseFloat(val.toString()).toFixed(2);
}


export function processOrderBookMessage(data: any): {sells: OrderRowIF[], buys: OrderRowIF[]} {
    const buysRaw = data.levels[0].slice(0, 11);
    const sellsRaw = data.levels[1].slice(0, 11);

    let buyTotal = 0;
    let sellTotal = 0;
    let buysProcessed: OrderRowIF[] = buysRaw.map((e: any) => {
      buyTotal += parseFloat(e.sz);
      return {
        px: formatNum(e.px),
        sz: formatNum(e.sz),
        n: parseInt(e.n),
        type: 'buy',
        total: formatNum(buyTotal)
      }
    });
    let sellsProcessed: OrderRowIF[] = sellsRaw.map((e: any) => {
      sellTotal += parseFloat(e.sz);
      return {
        px: formatNum(e.px),
        sz: formatNum(e.sz),
        n: parseInt(e.n),
        type: 'sell',
        total: formatNum(sellTotal)
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
