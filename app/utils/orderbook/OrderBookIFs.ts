export interface OrderRowIF{
    coin: string;
    px: number;
    sz: number;
    n: number;
    type: 'buy' | 'sell';
    total: number;
    ratio: number;
  }
  
export interface OrderRowResolutionIF {
val: number;
nsigfigs: number;
mantissa?: number | null;
}

export type OrderBookMode = 'symbol' | 'usd';