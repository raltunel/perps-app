import { useEffect, useRef } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';

import type { EntityId, IPaneApi } from '~/tv/charting_library';
import {
    addCustomOrderLine,
    createAnchoredMainText,
    createQuantityAnchoredText,
    getAnchoredQuantityTextLocation,
    priceToPixel,
} from '../customOrderLineUtils';

export type LineData = {
    xLoc: number;
    yLoc: number;
    text: string;
    quantityText?: string;
    color: string;
};

interface LineProps {
    lines: LineData[];
    setOrderLineItems: React.Dispatch<React.SetStateAction<ChartShapeRefs[]>>;
    orderLineItems: ChartShapeRefs[];
}

export type ChartShapeRefs = {
    lineId: EntityId;
    textId: EntityId;
    quantityTextId?: EntityId;
};

const LineComponent = ({
    lines,
    orderLineItems,
    setOrderLineItems,
}: LineProps) => {
    const { chart } = useTradingView();

    const orderLineItemsRef = useRef<ChartShapeRefs[]>([]);

    useEffect(() => {
        // let checkCleanState = false;
        // const cleanupShapes = () => {
        //     checkCleanState =true;
        //     try {
        //         if (chart) {
        //             const chartRef = chart.activeChart();
        //             const prevItems = orderLineItemsRef.current;

        //             orderLineItemsRef.current = prevItems.filter((order) => {
        //                 const { lineId, textId, quantityTextId } = order;

        //                 const element = chartRef.getShapeById(lineId);
        //                 if (element) chartRef.removeEntity(lineId);

        //                 const elementText = chartRef.getShapeById(textId);
        //                 if (elementText) chartRef.removeEntity(textId);

        //                 if (quantityTextId) {
        //                     const quantityElementText =
        //                         chartRef.getShapeById(quantityTextId);
        //                     if (quantityElementText)
        //                         chartRef.removeEntity(quantityTextId);
        //                 }

        //                 return false;
        //             });

        //             setOrderLineItems(orderLineItemsRef.current);

        //             console.log('removed Lines');
        //         }
        //     } catch (error: unknown) {
        //         setOrderLineItems([]);

        //         console.error({ error });
        //     }
        // };

        const setupShapes = async () => {
            if (!chart || lines.length === 0) return;
            const shapeRefs: ChartShapeRefs[] = [];

            for (const line of lines) {
                const lineId = await addCustomOrderLine(
                    chart,
                    line.yLoc,
                    line.color,
                );
                const textId = await createAnchoredMainText(
                    chart,
                    line.xLoc,
                    line.yLoc,
                    line.text,
                    line.color,
                );
                const quantityTextId = line.quantityText
                    ? await createQuantityAnchoredText(
                          chart,
                          line.xLoc,
                          line.yLoc,
                          line.text,
                      )
                    : undefined;

                shapeRefs.push({ lineId, textId, quantityTextId });
            }

            orderLineItemsRef.current = shapeRefs;
            setOrderLineItems(shapeRefs);
        };

        if (lines.length !== 0) {
            setupShapes();
        }
    }, [chart, lines.length]);

    useEffect(() => {
        let isCancelled = false;
        const intervals: number[] = [];

        const updateTextPosition = async () => {
            if (!chart || orderLineItems.length === 0 || lines.length === 0)
                return;

            orderLineItems.forEach((item, i) => {
                const lineData = lines[i];
                const { lineId, textId, quantityTextId } = item;

                const interval = setInterval(() => {
                    if (isCancelled) return;

                    const priceScalePane = chart
                        .activeChart()
                        .getPanes()[0] as IPaneApi;

                    const priceScale = priceScalePane.getMainSourcePriceScale();
                    if (priceScale) {
                        const priceRange = priceScale.getVisiblePriceRange();
                        const chartHeight = priceScalePane.getHeight();

                        if (!priceRange) return;

                        const maxPrice = priceRange.to;
                        const minPrice = priceRange.from;

                        const pixel = priceToPixel(
                            minPrice,
                            maxPrice,
                            chartHeight,
                            lineData.yLoc,
                            priceScale.getMode() === 1,
                        );
                        const pricePerPixel = pixel / chartHeight;

                        const activeLabel = chart
                            .activeChart()
                            .getShapeById(textId);

                        if (activeLabel) {
                            activeLabel.setProperties({
                                text: lineData.text,
                                wordWrapWidth:
                                    lineData.text.length > 13 ? 100 : 70,
                            });

                            activeLabel.setAnchoredPosition({
                                x: lineData.xLoc,
                                y: pricePerPixel,
                            });
                        }

                        if (quantityTextId && lineData.quantityText) {
                            const activeQuantityLabel = chart
                                .activeChart()
                                .getShapeById(quantityTextId);
                            if (activeQuantityLabel) {
                                activeQuantityLabel.setAnchoredPosition({
                                    x: getAnchoredQuantityTextLocation(
                                        chart,
                                        lineData.xLoc,
                                        lineData.text,
                                    ),
                                    y: pricePerPixel,
                                });
                                activeQuantityLabel.setProperties({
                                    text: lineData.quantityText,
                                    wordWrapWidth:
                                        lineData.quantityText.length > 8
                                            ? 70
                                            : 60,
                                });
                            }
                        }

                        const activeLine = chart
                            .activeChart()
                            .getShapeById(lineId);
                        if (activeLine) {
                            activeLine.setPoints([
                                { time: 10, price: lineData.yLoc },
                            ]);
                            activeLine.setProperties({
                                linecolor: lineData.color,
                                borderColor: lineData.color,
                            });
                        }
                    }
                }, 10) as unknown as number;

                intervals.push(interval);
            });
        };

        updateTextPosition();

        return () => {
            isCancelled = true;
            intervals.forEach(clearInterval);
        };
    }, [orderLineItems, chart, lines]);

    return null;
};

export default LineComponent;
