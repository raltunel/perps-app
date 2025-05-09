import { parseNum } from '../utils/orderbook/OrderBookUtils';
import type { PositionIF } from '../utils/position/PositionIFs';

export function processPosition(data: any): PositionIF {
    return {
        coin: data.position.coin,
        entryPx: parseNum(data.position.entryPx),
        leverage: {
            type: data.position.leverage.type,
            value: parseNum(data.position.leverage.value),
        },
        liquidationPx: parseNum(data.position.liquidationPx),
        marginUsed: parseNum(data.position.marginUsed),
        maxLeverage: parseNum(data.position.maxLeverage),
        positionValue: parseNum(data.position.positionValue),
        returnOnEquity: parseNum(data.position.returnOnEquity),
        szi: parseNum(data.position.szi),
        unrealizedPnl: parseNum(data.position.unrealizedPnl),
        type: data.type,
        cumFunding: {
            allTime: parseNum(data.position.cumFunding.allTime),
            sinceChange: parseNum(data.position.cumFunding.sinceChange),
            sinceOpen: parseNum(data.position.cumFunding.sinceOpen),
        },
    };
}
