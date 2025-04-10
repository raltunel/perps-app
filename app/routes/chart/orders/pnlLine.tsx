import { useEffect, useMemo, useRef, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import {
    addCustomOrderLine,
    buyColor,
    createQuantityText,
    createShapeText,
    getLabelText,
    getOrderQuantityTextLocation,
    priceToPixel,
    sellColor,
} from './customOrderLineUtils';

const PnlLine = () => {
    const { chart } = useTradingView();

    const { positions, symbol } = useTradeDataStore();

    const [orderLineItems, setOrderLineItems] = useState<any[]>([]);

    const [data, setData] = useState<any[]>([]);

    const symbolRef = useRef(symbol);

    useEffect(() => {
        setData([]);

        setTimeout(() => {
            symbolRef.current = symbol;
        }, 200);
    }, [symbol]);

    useEffect(() => {
        const tempData = positions
            .filter((i) => i.coin === symbol)
            .map((i) => {
                return {
                    price: i.entryPx,
                    pnl: i.unrealizedPnl.toFixed(2),
                    szi: i.szi,
                };
            });

        setData(tempData);
    }, [JSON.stringify(positions), symbolRef.current]);

    useEffect(() => {
        let isMounted = true;

        const cleanupShapes = () => {
            try {
                if (chart) {
                    orderLineItems.forEach((order: any) => {
                        const lineId = order.lineId;
                        const textId = order.text;
                        const quantityTextId = order.quantityText;

                        const element = chart
                            .activeChart()
                            .getShapeById(lineId);
                        element && chart.activeChart().removeEntity(lineId);

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
                data.map(async (item) => {
                    const lineId = await addCustomOrderLine(
                        chart,
                        item.price,
                        item.pnl > 0 ? 'buy' : 'sell',
                    );

                    const quantityText = await createQuantityText(
                        chart,
                        item.price,
                        item.szi,
                        'pnl',
                    );

                    const textId = await createShapeText(
                        chart,
                        item.pnl,
                        item.pnl > 0 ? 'buy' : 'sell',
                        'pnl',
                    );
                    return { lineId, textId, quantityText };
                }),
            );

            if (!isMounted) return;

            setOrderLineItems(
                shapePairs.map((p: any) => {
                    return {
                        lineId: p.lineId,
                        text: p.textId,
                        quantityText: p.quantityText,
                    };
                }),
            );
        };

        setupShapes();

        return () => {
            isMounted = false;
            cleanupShapes();
        };
    }, [chart, data.length]);

    useEffect(() => {
        let isCancelled = false;
        const intervals: number[] = [];

        const setupTextPositioning = async () => {
            if (!chart || orderLineItems.length === 0) return;

            for (let i = 0; i < orderLineItems.length; i++) {
                const lineShapeId = await orderLineItems[i].lineId;

                const textShapeId = await orderLineItems[i].text;

                const textQuantityTextId = await orderLineItems[i].quantityText;

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
                            data[i].price ?? 0,
                            priceScale.getMode() === 1,
                        );

                        const pricePerPixel = pixel / chartHeight;

                        const activeLabel = chart
                            .activeChart()
                            .getShapeById(textShapeId);

                        const bufferForLiqPrice = 0.1;
                        if (activeLabel) {
                            const orderText = getLabelText('pnl', data[i].pnl);

                            activeLabel.setProperties({
                                text: orderText,
                                wordWrapWidth: orderText.length > 13 ? 100 : 70,
                                borderColor:
                                    data[i].pnl > 0 ? buyColor : sellColor,
                            });

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
                                        'pnl',
                                        data[i].pnl,
                                    ),
                                    y: pricePerPixel,
                                });

                            activeQuantityLabel.setProperties({
                                text: data[i].szi,
                                wordWrapWidth:
                                    data[i].pnl.toString().length > 8 ? 70 : 60,
                            });
                        }

                        if (lineShapeId) {
                            const activeLine = chart
                                .activeChart()
                                .getShapeById(lineShapeId);
                            if (activeLine) {
                                activeLine.setPoints([
                                    {
                                        time: 10,
                                        price: data[i].price,
                                    },
                                ]);
                                const orderColor =
                                    data[i].pnl > 0 ? buyColor : sellColor;
                                activeLine.setProperties({
                                    linecolor: orderColor,
                                    borderColor: orderColor,
                                });
                            }
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
    }, [orderLineItems, chart, JSON.stringify(data)]);

    return <></>;
};

export default PnlLine;
