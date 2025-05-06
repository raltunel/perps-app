export interface UserBalanceIF {
    coin: string;
    type: 'spot' | 'margin';
    entryNtl: number;
    hold: number;
    total: number;
    sortName: string;
    usdcValue: number;
    pnlValue: number;
    available: number;
    metaIndex: number;
    buyingPower: number;
}

export interface AccountOverviewIF {
    balance: number;
    unrealizedPnl: number;
    crossMarginRatio: number;
    maintainanceMargin: number;
    crossAccountLeverage: number;
    balanceChange?: number;
    maintainanceMarginChange?: number;
}

export type UserBalanceSortBy =
    | 'sortName'
    | 'total'
    | 'available'
    | 'usdcValue'
    | 'buyingPower'
    | 'pnlValue'
    | undefined;

export interface UserFillIF {
    time: number;
    coin: string;
    crossed: boolean;
    dir: string;
    fee: number;
    hash: string;
    oid: number;
    px: number;
    side: 'buy' | 'sell';
    sz: number;
    tid: number;
    value: number;
}

export type UserFillSortBy =
    | 'time'
    | 'coin'
    | 'side'
    | 'px'
    | 'sz'
    | 'value'
    | 'fee'
    | undefined;
