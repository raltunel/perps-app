import { useEffect, useMemo, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useDebugStore } from '~/stores/DebugStore';
import type { ChartShapeRefs, LineData } from './component/LineComponent';
import { buyColor, sellColor } from './customOrderLineUtils';
import LineComponent from './component/LineComponent';

const OpenOrderLine = () => {
    const { chart } = useTradingView();
    const { userSymbolOrders, positions, symbol } = useTradeDataStore();
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

    const pnlSzi = useMemo(() => {
        const data = positions
            .filter((i) => i.coin === symbol)
            .map((i) => {
                return {
                    price: i.entryPx,
                    pnl: Number(i.unrealizedPnl.toFixed(2)),
                    szi: i.szi,
                    liqPrice: i.liquidationPx,
                };
            });

        if (data.length > 0) {
            return data[0].szi;
        } else {
            return undefined;
        }
    }, [JSON.stringify(positions), symbol]);

    function formatTPorSLLabel(rawText: string, orderType: string): string {
        const match = rawText.match(/Price (above|below) (\d+)/);

        if (!match) return rawText;

        const direction = match[1];
        const price = match[2];
        const operator = direction === 'above' ? '>' : '<';

        const labelPrefix = orderType === 'Take Profit Market' ? 'TP' : 'SL';

        return `${labelPrefix} Price ${operator} ${price}`;
    }

    useEffect(() => {
        if (!chart || !userSymbolOrders?.length || !pnlSzi) {
            setLines([]);
            return;
        }
        const newLines: LineData[] = userSymbolOrders.map((order) => {
            const { sz, side } = order;

            let price = order.limitPx;

            let quantityText = 0;
            let orderText: string | undefined = '';

            if (order.orderType === 'Limit') {
                orderText = ' Limit  ' + price;
                quantityText = order.sz;
            } else {
                if (order.triggerCondition && order.orderType) {
                    orderText = formatTPorSLLabel(
                        order.triggerCondition,
                        order.orderType,
                    );
                    if (order.triggerPx) price = order.triggerPx;
                    quantityText = pnlSzi;
                }
            }

            return {
                xLoc: 0.4,
                yLoc: price,
                text: orderText,
                quantityText: quantityText.toFixed(5),
                color: side === 'buy' ? buyColor : sellColor,
            };
        });

        setLines(newLines);
    }, [
        chart,
        JSON.stringify(userSymbolOrders),
        debugWallet,
        symbol,
        JSON.stringify(pnlSzi),
    ]);

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
