export type LiqLevelRaw = {
    0: number;
    1: number;
};

export type LiqLevelMessage = {
    market: {
        aggregated: {
            levels: LiqLevelRaw[];
        };
        marketId: number;
        positionCount: number;
        timestamp: number;
    };
};

export type LiqLevel = {
    sz: number;
    type: 'buy' | 'sell';
    px: number;
    ratio?: number; // ratio of the level to the max size of the book side
    cumulativeSz?: number; // cumulative size to that level
    cumulativeRatio?: number; // cumulative ratio to that level
};

export const parseLiqLevelRaw = (
    level: LiqLevelRaw,
    type: 'buy' | 'sell',
    cumulativeSz: number,
    maxSz: number,
    totalSz: number,
    // cumulativeRatioCoef : number = 1,
): LiqLevel => {
    const sz = level[1] / 1e8;
    return {
        sz: sz,
        px: level[0] / 1e6,
        type: type,
        cumulativeSz: cumulativeSz + sz,
        ratio: sz / maxSz,
        cumulativeRatio: (2 * (cumulativeSz + sz)) / totalSz,
    };
};
