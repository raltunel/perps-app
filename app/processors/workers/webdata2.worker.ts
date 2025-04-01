// jsonParser.worker.js

import type { SymbolInfoIF } from "../../utils/SymbolInfoIFs";
import { processSymbolInfo } from "../processSymbolInfo";
import type { OrderDataIF } from "../../utils/orderbook/OrderBookIFs";
import { processUserOrder } from "../processOrderBook";




self.onmessage = function (event) {
    try {
        const parsedData = JSON.parse(event.data);
        const coins: SymbolInfoIF[] = [];
        const userOpenOrders: OrderDataIF[] = [];

        const data = parsedData.data;


        if (data) {
            if (data.meta && data.meta.universe && data.assetCtxs) {
                data.meta.universe.forEach((coin: any) => {
                    const indexOfCoin = data.meta.universe.findIndex(
                        (item: any) => item.name === coin.name,
                    );
                    const ctxVal = data.assetCtxs[indexOfCoin];
                    if (ctxVal !== null) {
                        const coinObject = processSymbolInfo({
                            coin: coin.name,
                            ctx: ctxVal,
                        });
                        coins.push(coinObject);
                    }
                });
                data.openOrders.forEach((order: any) => {
                    const processedOrder = processUserOrder(order, 'open');
                    if (processedOrder) {
                        userOpenOrders.push(processedOrder);
                    }
                })
            }
        }

        self.postMessage({ channel: parsedData.channel, data: { coins, userOpenOrders, user: data.user } });


    } catch (error) {
        self.postMessage({ error: (error as Error).message });
    }
};
