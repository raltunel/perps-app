import { useEffect, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useDebugStore } from '~/stores/DebugStore';
import type { LineData } from './component/LineComponent';
import { buyColor, sellColor } from './customOrderLineUtils';
import LineComponent from './component/LineComponent';

const OpenOrderLine = () => {
    const { chart } = useTradingView();
    const { userSymbolOrders, symbol } = useTradeDataStore();
    const { debugWallet } = useDebugStore();

    const [lines, setLines] = useState<LineData[]>([]);

    useEffect(() => {
        if (!chart || !userSymbolOrders?.length) {
            setLines([]);
            return;
        }
        const newLines: LineData[] = userSymbolOrders.map((order) => {
            const { limitPx: price, sz, side } = order;

            let orderText: string | undefined = '';

            if (order.orderType === 'Limit') {
                orderText = ' Limit  ' + price;
            } else {
                orderText = order.orderType ? order.orderType : '';
            }

            return {
                xLoc: 0.4,
                yLoc: price,
                text: orderText,
                quantityText: sz.toFixed(5),
                color: side === 'buy' ? buyColor : sellColor,
            };
        });

        setLines(newLines);
    }, [JSON.stringify(userSymbolOrders), debugWallet, symbol]);

    if (!chart) return null;

    return <LineComponent key='limit' lines={lines} />;
};

export default OpenOrderLine;
