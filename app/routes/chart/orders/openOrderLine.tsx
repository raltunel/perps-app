import { useEffect, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useDebugStore } from '~/stores/DebugStore';
import type { ChartShapeRefs, LineData } from './component/LineComponent';
import { buyColor, sellColor } from './customOrderLineUtils';
import LineComponent from './component/LineComponent';

const OpenOrderLine = () => {
    const { chart } = useTradingView();
    const { userSymbolOrders, symbol } = useTradeDataStore();
    const { debugWallet } = useDebugStore();

    const [lines, setLines] = useState<LineData[]>([]);

    const [orderLineItems, setOrderLineItems] = useState<ChartShapeRefs[]>([]);

    const [activeLines, setActiveLines] = useState(true);

    const cleanupShapes = async () => {
        setActiveLines(false);
        try {
            if (chart) {
                const chartRef = chart.activeChart();

                const tempOrderLines = orderLineItems.filter((order) => {
                    const { lineId, textId, quantityTextId } = order;

                    const element = chartRef.getShapeById(lineId);
                    if (element) chartRef.removeEntity(lineId);

                    const elementText = chartRef.getShapeById(textId);
                    if (elementText) chartRef.removeEntity(textId);

                    if (quantityTextId) {
                        const quantityElementText =
                            chartRef.getShapeById(quantityTextId);
                        if (quantityElementText)
                            chartRef.removeEntity(quantityTextId);
                    }

                    return false;
                });

                setOrderLineItems(tempOrderLines);
            }
        } catch (error: unknown) {
            setOrderLineItems([]);

            console.error({ error });
        }
    };

    useEffect(() => {
        cleanupShapes().then(() => {
            setTimeout(() => {
                setActiveLines(true);
            }, 1000);
        });
    }, [symbol]);

    useEffect(() => {
        if (!chart || !userSymbolOrders?.length) {
            setLines([]);
            return;
        }
        const newLines: LineData[] = userSymbolOrders.map((order) => {
            const { sz, side } = order;

            let price = order.limitPx;

            let orderText: string | undefined = '';

            if (order.orderType === 'Limit') {
                orderText = ' Limit  ' + price;
            } else {
                orderText = order.orderType ? order.orderType : '';
                if (order.triggerPx) price = order.triggerPx;
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
    }, [chart, JSON.stringify(userSymbolOrders), debugWallet, symbol]);

    if (!chart || !activeLines) return null;

    return (
        <LineComponent
            key='limit'
            lines={lines}
            orderLineItems={orderLineItems}
            setOrderLineItems={setOrderLineItems}
        />
    );
};

export default OpenOrderLine;
