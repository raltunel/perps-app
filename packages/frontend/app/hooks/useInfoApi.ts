import { processUserOrder } from '~/processors/processOrderBook';
import {
    processUserFills,
    processUserTwapHistory,
    processUserTwapSliceFills,
} from '~/processors/processUserFills';
import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';
import type {
    TwapHistoryIF,
    TwapSliceFillIF,
    UserFillIF,
} from '~/utils/UserDataIFs';

export type ApiCallConfig = {
    type: string;
    handler: (data: any, payload: any) => void;
    payload?: any;
};

export enum ApiEndpoints {
    HISTORICAL_ORDERS = 'historicalOrders',
    OPEN_ORDERS = 'frontendOpenOrders',
    USER_FILLS = 'userFills',
    TWAP_HISTORY = 'twapHistory',
    TWAP_SLICE_FILLS = 'userTwapSliceFills',
    USER_PORTFOLIO = 'portfolio',
}

// const apiUrl = 'https://api-ui.hyperliquid.xyz/info';
const apiUrl = 'https://api.hyperliquid.xyz/info';

export function useInfoApi() {
    const fetchData = async (config: ApiCallConfig) => {
        const payload = { type: config.type, ...config.payload };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        config.handler(data, payload);
    };

    const fetchOrderHistory = async (
        address: string,
    ): Promise<OrderDataIF[]> => {
        const ret: OrderDataIF[] = [];
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: ApiEndpoints.HISTORICAL_ORDERS,
                user: address,
            }),
        });
        const data = await response.json();
        if (data && data.length > 0) {
            data.map((o: any) => {
                const processedOrder = processUserOrder(o.order, o.status);
                if (processedOrder) {
                    ret.push(processedOrder);
                }
            });
        }
        return ret;
    };

    const fetchUserFills = async (address: string): Promise<UserFillIF[]> => {
        const ret: UserFillIF[] = [];
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: ApiEndpoints.USER_FILLS,
                user: address,
            }),
        });
        const data = await response.json();
        if (data && data.length > 0) {
            const processed = processUserFills({
                fills: data,
                isSnapshot: true,
                user: '',
            });
            if (processed.length > 0) {
                ret.push(...processed);
            }
        }
        return ret;
    };

    const fetchTwapHistory = async (
        address: string,
    ): Promise<TwapHistoryIF[]> => {
        const ret: TwapHistoryIF[] = [];
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: ApiEndpoints.TWAP_HISTORY,
                user: address,
            }),
        });
        const data = await response.json();
        if (data && data.length > 0) {
            const processed = processUserTwapHistory({
                history: data,
                isSnapshot: true,
                user: '',
            });
            if (processed.length > 0) {
                ret.push(...processed);
            }
        }
        return ret;
    };

    const fetchTwapSliceFills = async (
        address: string,
    ): Promise<TwapSliceFillIF[]> => {
        const ret: TwapSliceFillIF[] = [];

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: ApiEndpoints.TWAP_SLICE_FILLS,
                user: address,
            }),
        });
        const data = await response.json();
        if (data && data.length > 0) {
            const processed = processUserTwapSliceFills({
                user: address,
                twapSliceFills: data,
                isSnapshot: true,
            });
            if (processed.length > 0) {
                ret.push(...processed);
            }
        }
        return ret;
    };

    const fetchUserPortfolio = async (
        address: string,
    ): Promise<Map<string, {}>> => {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: ApiEndpoints.USER_PORTFOLIO,
                user: address,
            }),
        });

        const obj = new Map<string, {}>();

        const data = await response.json();
        if (data && data.length > 0) {
            for (const [timeframe, position] of data) {
                obj.set(timeframe, {
                    ...position,
                });
            }
        }

        return obj;
    };

    return {
        fetchData,
        fetchOrderHistory,
        fetchUserFills,
        fetchTwapHistory,
        fetchTwapSliceFills,
        fetchUserPortfolio,
    };
}
