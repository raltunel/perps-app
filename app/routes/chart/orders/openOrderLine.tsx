import { useEffect, useMemo, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import {
    addCustomOrderLine,
    createQuantityText,
    createShapeText,
    getOrderQuantityTextLocation,
    priceToPixel,
} from './customOrderLineUtils';
import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';

interface OrderLineProps {}

const OpenOrderLine = (props: OrderLineProps) => {
    const { chart } = useTradingView();
    const { userSymbolOrders } = useTradeDataStore();

    const [orderLines, setOrderLines] = useState<any[]>([]);
    const [orderTexts, setOrderTexts] = useState<any[]>([]);

    const data = useMemo(() => {
        return userSymbolOrders.map((i) => {
            return {
                timestamp: i.timestamp,
                price: i.limitPx,
                sz: i.sz,
                side: i.side,
            };
        });
    }, [JSON.stringify(userSymbolOrders)]);

    useEffect(() => {
        let isMounted = true;

        const cleanupShapes = () => {
            try {
                if (chart) {
                    orderLines.forEach((id) => {
                        const element = chart.activeChart().getShapeById(id);
                        element && chart.activeChart().removeEntity(id);
                    });

                    orderTexts.forEach((orderTexts) => {
                        const textId = orderTexts.text;
                        const quantityTextId = orderTexts.quantityText;

                        const elementText = chart
                            .activeChart()
                            .getShapeById(textId);
                        const quantityElementText = chart
                            .activeChart()
                            .getShapeById(quantityTextId);

                        elementText && chart.activeChart().removeEntity(textId);
                        quantityElementText &&
                            chart.activeChart().removeEntity(quantityTextId);
                    });
                }
            } catch (error) {}
        };

        const setupShapes = async () => {
            if (!chart || data.length === 0) return;

            cleanupShapes();

            const shapePairs = await Promise.all(
                data
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map(async (item) => {
                        const lineId = await addCustomOrderLine(
                            chart,
                            item.price,
                            item.side,
                        );

                        const quantityText = await createQuantityText(
                            chart,
                            item.price,
                            item.sz,
                        );

                        const textId = await createShapeText(
                            chart,
                            item.price,
                            item.side,
                            'limit',
                        );
                        return { lineId, textId, quantityText };
                    }),
            );

            if (!isMounted) return;

            setOrderLines(shapePairs.map((p: any) => p.lineId));
            setOrderTexts(
                shapePairs.map((p: any) => {
                    return { text: p.textId, quantityText: p.quantityText };
                }),
            );
        };

        setupShapes();

        return () => {
            isMounted = false;
            cleanupShapes();
        };
    }, [chart, data]);

    useEffect(() => {
        let isCancelled = false;
        const intervals: number[] = [];

        const setupTextPositioning = async () => {
            if (!chart || orderTexts.length === 0) return;

            for (let i = 0; i < orderTexts.length; i++) {
                const textShapeId = await orderTexts[i].text;
                const textQuantityTextId = await orderTexts[i].quantityText;

                const interval = setInterval(() => {
                    try {
                        if (isCancelled) return;

                        const priceScalePane = chart
                            .activeChart()
                            .getPanes()[0] as any;
                        const priceScale =
                            priceScalePane.getMainSourcePriceScale();
                        const priceRange = priceScale.getVisiblePriceRange();
                        const chartHeight = priceScalePane.getHeight();

                        if (!priceRange) return;

                        const maxPrice = priceRange.to;
                        const minPrice = priceRange.from;

                        const pixel = priceToPixel(
                            minPrice,
                            maxPrice,
                            chartHeight,
                            data[i]?.price ?? 0,
                            priceScale.getMode() === 1,
                        );

                        const pricePerPixel = pixel / chartHeight;

                        const activeLabel = chart
                            .activeChart()
                            .getShapeById(textShapeId);

                        const activeQuantityLabel = chart
                            .activeChart()
                            .getShapeById(textQuantityTextId);

                        const bufferX = 0.4;
                        if (activeLabel) {
                            activeLabel.setAnchoredPosition({
                                x: bufferX,
                                y: pricePerPixel,
                            });

                            activeQuantityLabel.setAnchoredPosition({
                                x: getOrderQuantityTextLocation(bufferX, chart),
                                y: pricePerPixel,
                            });

                            chart.activeChart().restoreChart();
                        }
                    } catch (error) {}
                }, 10) as unknown as number;

                intervals.push(interval);
            }
        };

        setupTextPositioning();

        return () => {
            isCancelled = true;
            intervals.forEach(clearInterval);
        };
    }, [orderTexts, chart, JSON.stringify(data)]);

    return null;
};

export default OpenOrderLine;
