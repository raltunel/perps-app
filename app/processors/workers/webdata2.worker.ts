// jsonParser.worker.js

import type { SymbolInfoIF } from "../../utils/SymbolInfoIFs";
import { processSymbolInfo } from "../processSymbolInfo";
import type { OrderDataIF } from "../../utils/orderbook/OrderBookIFs";
import { processUserOrder } from "../processOrderBook";
import { processPosition } from "../processPosition";
import type { PositionIF } from "../../utils/position/PositionIFs";



self.onmessage = function (event) {
    try {
        const size = event.data.length;
        const parsedData = JSON.parse(event.data);
        const coins: SymbolInfoIF[] = [];
        const userOpenOrders: OrderDataIF[] = [];
        const positions: PositionIF[] = [];
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
                            szDecimals: coin.szDecimals,
                            maxLeverage: coin.maxLeverage,
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

                if(data.clearinghouseState){
                    data.clearinghouseState.assetPositions.forEach((position: any) => {
                        const processedPosition = processPosition(position);
                        positions.push(processedPosition);
                    })
                }
            }
        }

        self.postMessage({ channel: parsedData.channel, data: { coins, userOpenOrders, user: data.user, size, positions } });


    } catch (error) {
        self.postMessage({ error: (error as Error).message });
    }
};
