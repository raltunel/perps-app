import { useEffect, useMemo, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import {
    addCustomOrderLine,
    createShapeText,
    getOrderQuantityTextLocation,
    priceToPixel,
} from './customOrderLineUtils';

const PositionsLine = () => {
    const { chart } = useTradingView();

    const { positions, symbol } = useTradeDataStore();

    const [orderLines, setOrderLines] = useState<any[]>([]);
    const [orderTexts, setOrderTexts] = useState<any[]>([]);

    const data = useMemo(() => {                
        return positions.filter((i) => i.coin === symbol).map((i)=>i.liquidationPx);
    }, [JSON.stringify(positions), symbol]);

    
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

                        elementText && chart.activeChart().removeEntity(textId);

                        if (quantityTextId) {
                            const quantityElementText = chart
                                .activeChart()
                                .getShapeById(quantityTextId);
                            quantityElementText &&
                                chart
                                    .activeChart()
                                    .removeEntity(quantityTextId);
                        }
                    });
                }
            } catch (error) {}
        };

        const setupShapes = async () => {
            if (!chart || data.length === 0) return;

            cleanupShapes();

            const shapePairs = await Promise.all(
                data.map(async (item) => {
                    const lineId = await addCustomOrderLine(
                        chart,
                        item,
                        'sell',
                    );

                    const textId = await createShapeText(
                        chart,
                        item,
                        'sell',
                        'liq',
                    );

                    const quantityText = undefined;
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
                            data[i] ?? 0,
                            priceScale.getMode() === 1,
                        );

                        const pricePerPixel = pixel / chartHeight;

                        const activeLabel = chart
                            .activeChart()
                            .getShapeById(textShapeId);

                        const bufferForLiqPrice = 0.2;
                        if (activeLabel) {
                            activeLabel.setAnchoredPosition({
                                x: bufferForLiqPrice,
                                y: pricePerPixel,
                            });
                        }

                        if (textQuantityTextId) {
                            const activeQuantityLabel = chart
                                .activeChart()
                                .getShapeById(textQuantityTextId);
                            activeQuantityLabel &&
                                activeQuantityLabel.setAnchoredPosition({
                                    x: getOrderQuantityTextLocation(
                                        bufferForLiqPrice,
                                        chart,
                                    ),
                                    y: pricePerPixel,
                                });
                        }

                        chart.activeChart().restoreChart();
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

export default PositionsLine;
