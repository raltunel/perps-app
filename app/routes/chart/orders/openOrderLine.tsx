import { useEffect, useMemo, useRef, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import {
    addCustomOrderLine,
    createQuantityText,
    createShapeText,
    getOrderQuantityTextLocation,
    priceToPixel,
} from './customOrderLineUtils';
import { useDebugStore } from '~/stores/DebugStore';

interface OrderLineProps {}

const OpenOrderLine = (props: OrderLineProps) => {
    const { chart } = useTradingView();
    const { userSymbolOrders, symbol } = useTradeDataStore();

    const [orderLineItems, setOrderLineItems] = useState<any[]>([]);

    const { debugWallet } = useDebugStore();

    const [data, setData] = useState<any[]>([]);

    const symbolRef = useRef(symbol);

    useEffect(() => {
        setData([]);
    }, [debugWallet]);

    useEffect(() => {
        setData([]);

        setTimeout(() => {
            symbolRef.current = symbol;
        }, 200);
    }, [symbol]);

    useEffect(() => {
        if (symbol === symbolRef.current) {
            const tempData = userSymbolOrders.map((i) => {
                return {
                    timestamp: i.timestamp,
                    price: i.limitPx,
                    sz: i.sz,
                    side: i.side,
                };
            });

            setData(tempData);
        }
    }, [JSON.stringify(userSymbolOrders), symbolRef.current]);

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
                            'limit',
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
    }, [chart, data]);

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

                        const activeLine = chart
                            .activeChart()
                            .getShapeById(lineShapeId);

                        const bufferX = 0.4;
                        if (activeLabel) {
                            activeLabel.setAnchoredPosition({
                                x: bufferX,
                                y: pricePerPixel,
                            });

                            activeQuantityLabel.setAnchoredPosition({
                                x: getOrderQuantityTextLocation(
                                    bufferX,
                                    chart,
                                    'limit',
                                    data[i].price,
                                ),
                                y: pricePerPixel,
                            });

                            chart.activeChart().restoreChart();
                        }

                        if (activeLine) {
                            activeLine.setPoints([
                                {
                                    time: 10,
                                    price: data[i]?.price,
                                },
                            ]);
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
    }, [orderLineItems, chart, JSON.stringify(data)]);

    return null;
};

export default OpenOrderLine;
