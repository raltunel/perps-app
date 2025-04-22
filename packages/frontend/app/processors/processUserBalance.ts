import type { UserBalanceIF } from '~/utils/UserDataIFs';
import { parseNum } from '../utils/orderbook/OrderBookUtils';

const coinConversion = (coin: string) => {
    if (coin === 'UBTC') {
        return 'BTC';
    }
    return coin;
};

export function processUserBalance(
    data: any,
    type: 'spot' | 'margin',
): UserBalanceIF {
    return {
        coin: coinConversion(data.coin),
        type: type,
        hold: parseNum(data.hold),
        total: parseNum(data.total),
        entryNtl: parseNum(data.entryNtl),
    };
}
