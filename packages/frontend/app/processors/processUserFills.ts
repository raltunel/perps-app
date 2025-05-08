import type {
    UserBalanceIF,
    UserBalanceSortBy,
    UserFillIF,
    UserFillSortBy,
} from '~/utils/UserDataIFs';
import { parseNum } from '../utils/orderbook/OrderBookUtils';
import type { TableSortDirection } from '~/utils/CommonIFs';
import type { UserFillsData } from '@perps-app/sdk/src/utils/types';

export function processUserFills(data: UserFillsData): UserFillIF[] {
    const ret: UserFillIF[] = [];
    data.fills.forEach((fill) => {
        ret.push({
            time: fill.time,
            coin: fill.coin,
            crossed: fill.crossed,
            dir: fill.dir,
            hash: fill.hash,
            oid: fill.oid,
            px: parseNum(fill.px),
            side: fill.side === 'A' ? 'sell' : 'buy',
            sz: parseNum(fill.sz),
            tid: fill.tid,
            fee: parseNum(fill.fee),
            value: parseNum(fill.sz) * parseNum(fill.px),
            closedPnl: parseFloat(fill.closedPnl),
        } as UserFillIF);
    });
    return ret;
}

export function sortUserFills(
    fills: UserFillIF[],
    sortBy: UserFillSortBy,
    sortDirection: TableSortDirection,
) {
    if (sortDirection && sortBy) {
        switch (sortBy) {
            case 'time':
                return fills.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.time - b.time;
                    } else {
                        return b.time - a.time;
                    }
                });
            case 'coin':
                return fills.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.coin.localeCompare(b.coin);
                    } else {
                        return b.coin.localeCompare(a.coin);
                    }
                });
            case 'side':
                return fills.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.side.localeCompare(b.side);
                    } else {
                        return b.side.localeCompare(a.side);
                    }
                });
            case 'px':
                return fills.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.px - b.px;
                    } else {
                        return b.px - a.px;
                    }
                });
            case 'sz':
                return fills.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.sz - b.sz;
                    } else {
                        return b.sz - a.sz;
                    }
                });
            case 'value':
                return fills.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.value - b.value;
                    } else {
                        return b.value - a.value;
                    }
                });
            case 'fee':
                return fills.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.fee - b.fee;
                    } else {
                        return b.fee - a.fee;
                    }
                });
            case 'closedPnl':
                return fills.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.closedPnl - b.closedPnl;
                    } else {
                        return b.closedPnl - a.closedPnl;
                    }
                });
            default:
                return fills.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.time - b.time;
                    } else {
                        return b.time - a.time;
                    }
                });
        }
    }
    return fills.sort((a, b) => {
        if (sortDirection === 'asc') {
            return a.time - b.time;
        } else {
            return b.time - a.time;
        }
    });
}
