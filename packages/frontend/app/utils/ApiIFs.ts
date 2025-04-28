export interface TokenMetaIF {
    deployerTradingFeeShare: string;
    evmContract?: string;
    fullName?: string;
    isCanonical: boolean;
    szDecimals: number;
    tokenId: string;
    weiDecimals: number;
    name: string;
    index: number;
    price?: number; // is fetched with another api request
}

export interface TokenDetailsIF {
    circulatingSupply: string;
    deployGas: string;
    deployTime: string;
    deployer: string;
    futureEmissions: string;
    markPx: string;
    maxSupply: string;
    midPx: string;
    name: string;
    prevDayPx: string;
    seededUsdc: string;
    szDecimals: number;
    totalSupply: string;
    weiDecimals: number;
}
