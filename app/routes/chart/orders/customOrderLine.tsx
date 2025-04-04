import { useEffect, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import {
    addCustomOrderLine,
    createShapeText,
    priceToPixel,
} from './customOrderLineUtils';

const CustomOrderLine = () => {
    const { chart } = useTradingView();

    const { userSymbolOrders } = useTradeDataStore();
    const [orderLines, setOrderLines] = useState<any[]>([]);
    const [orderTexts, setOrderTexts] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;

        const cleanupShapes = () => {
            try {
                if (chart) {
                    orderLines.forEach((id) => {
                        chart.activeChart().removeEntity(id);
                    });

                    orderTexts.forEach((id) => {
                        chart.activeChart().removeEntity(id);
                    });
                }
            } catch (error) {}
        };

        const setupShapes = async () => {
            if (!chart || userSymbolOrders.length === 0) return;

            cleanupShapes();

            const shapePairs = await Promise.all(
                userSymbolOrders.map(async (item) => {
                    const lineId = await addCustomOrderLine(
                        chart,
                        item.limitPx,
                        item.side,
                    );
                    const textId = await createShapeText(
                        chart,
                        item.limitPx,
                        item.side,
                        'limit',
                    );
                    return { lineId, textId };
                }),
            );

            if (!isMounted) return;

            setOrderLines(shapePairs.map((p) => p.lineId));
            setOrderTexts(shapePairs.map((p) => p.textId));
        };

        setupShapes();

        return () => {
            isMounted = false;
            cleanupShapes();
        };
    }, [chart, userSymbolOrders]);

    useEffect(() => {
        let isCancelled = false;
        const intervals: number[] = [];

        const setupTextPositioning = async () => {
            if (!chart || orderTexts.length === 0) return;

            for (let i = 0; i < orderTexts.length; i++) {
                const textShapeId = await orderTexts[i];

                const interval = setInterval(() => {
                    if (isCancelled) return;

                    const priceScalePane = chart
                        .activeChart()
                        .getPanes()[0] as any;
                    const priceScale = priceScalePane.getMainSourcePriceScale();
                    const priceRange = priceScale.getVisiblePriceRange();
                    const chartHeight = priceScalePane.getHeight();

                    if (!priceRange) return;

                    const maxPrice = priceRange.to;
                    const minPrice = priceRange.from;

                    const pixel = priceToPixel(
                        minPrice,
                        maxPrice,
                        chartHeight,
                        userSymbolOrders[i]?.limitPx ?? 0,
                        priceScale.getMode() === 1,
                    );

                    const pricePerPixel = pixel / chartHeight;

                    const activeLabel = chart
                        .activeChart()
                        .getShapeById(textShapeId);
                    if (activeLabel) {
                        activeLabel.setAnchoredPosition({
                            x: 0.4,
                            y: pricePerPixel,
                        });
                        chart.activeChart().restoreChart();
                    }
                }, 10) as unknown as number;

                intervals.push(interval);
            }
        };

        setupTextPositioning();

        return () => {
            isCancelled = true;
            intervals.forEach(clearInterval);
        };
    }, [orderTexts, chart, userSymbolOrders]);

    return null;
};

export default CustomOrderLine;
