export interface UserBalanceIF {
    coin: string;
    type: 'spot' | 'margin';
    entryNtl: number;
    hold: number;
    total: number;
}
