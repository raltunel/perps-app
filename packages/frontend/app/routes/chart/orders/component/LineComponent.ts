/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';

import type { EntityId, IPaneApi } from '~/tv/charting_library';
import {
    addCustomOrderLine,
    createAnchoredMainText,
    createCancelAnchoredText,
    createQuantityAnchoredText,
    estimateTextWidth,
    formatLineLabel,
    getAnchoredCancelButtonTextLocation,
    getAnchoredQuantityTextLocation,
    isInsideTextBounds,
    priceToPixel,
    quantityTextFormatWithComma,
    type LineLabel,
} from '../customOrderLineUtils';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useDebugStore } from '~/stores/DebugStore';

export type LineData = {
    xLoc: number;
    yPrice: number;
    textValue: LineLabel;
    quantityTextValue?: number;
    color: string;
    type: 'PNL' | 'LIMIT' | 'LIQ';
};

interface LineProps {
    lines: LineData[];
    orderType: 'openOrder' | 'position';
}

export type ChartShapeRefs = {
    lineId: EntityId;
    textId: EntityId;
    quantityTextId?: EntityId;
    cancelButtonTextId?: EntityId;
};

const LineComponent = ({ lines, orderType }: LineProps) => {
    const { chart } = useTradingView();

    const orderLineItemsRef = useRef<ChartShapeRefs[]>([]);

    const [orderLineItems, setOrderLineItems] = useState<ChartShapeRefs[]>([]);

    const { symbol } = useTradeDataStore();
    const { debugWallet } = useDebugStore();

    const cleanupShapes = async () => {
        try {
            if (chart) {
                const chartRef = chart.activeChart();
                const prevItems = orderLineItemsRef.current;

                for (const order of prevItems) {
                    const {
                        lineId,
                        textId,
                        quantityTextId,
                        cancelButtonTextId,
                    } = order;

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

                    if (cancelButtonTextId) {
                        const cancelButtonText =
                            chartRef.getShapeById(cancelButtonTextId);
                        if (cancelButtonText)
                            chartRef.removeEntity(cancelButtonTextId);
                    }
                }

                orderLineItemsRef.current = [];
                setOrderLineItems([]);
            }
        } catch (error: unknown) {
            orderLineItemsRef.current = [];
            setOrderLineItems([]);
            console.error({ error });
        }
    };

    const [chartReady, setChartReady] = useState(true);

    const [zoomChanged, setZoomChanged] = useState(false);
    const prevRangeRef = useRef<{ min: number; max: number } | null>(null);
    const animationFrameRef = useRef<number>(0);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isZoomingRef = useRef(false);

    useEffect(() => {
        if (!chart) return;

        const chartRef = chart.activeChart();
        const priceScalePane = chartRef.getPanes()[0] as IPaneApi;
        const priceScale = priceScalePane.getMainSourcePriceScale();
        if (!priceScale) return;

        const loop = () => {
            const priceRange = priceScale.getVisiblePriceRange();
            if (priceRange) {
                const currentRange = {
                    min: priceRange.from,
                    max: priceRange.to,
                };

                const prevRange = prevRangeRef.current;
                const hasChanged =
                    !prevRange ||
                    prevRange.min !== currentRange.min ||
                    prevRange.max !== currentRange.max;

                if (hasChanged) {
                    prevRangeRef.current = currentRange;

                    if (!isZoomingRef.current) {
                        isZoomingRef.current = true;
                        setZoomChanged(true);
                    }

                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                    }

                    debounceTimerRef.current = setTimeout(() => {
                        isZoomingRef.current = false;
                        setZoomChanged(false);
                    }, 200);
                }
            }

            animationFrameRef.current = requestAnimationFrame(loop);
        };

        animationFrameRef.current = requestAnimationFrame(loop);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [chart]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined = undefined;

        const chartRef = chart?.activeChart();
        setChartReady(false);
        cleanupShapes();
        if (!chartRef) return;

        intervalId = setInterval(async () => {
            const current = chartRef.symbol();
            if (current === symbol) {
                setTimeout(() => {
                    setChartReady(true);
                }, 2500);

                clearInterval(intervalId);
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
            setChartReady(false);
        };
    }, [symbol, debugWallet]);

    useEffect(() => {
        const setupShapes = async () => {
            if (!chart || lines.length === 0) return;
            const shapeRefs: ChartShapeRefs[] = [];

            for (const line of lines) {
                let cancelButtonTextId = undefined;
                const lineId = await addCustomOrderLine(
                    chart,
                    line.yPrice,
                    line.color,
                );
                const textId = await createAnchoredMainText(
                    chart,
                    line.xLoc,
                    line.yPrice,
                    line.textValue,
                    line.color,
                );
                const quantityTextId = line.quantityTextValue
                    ? await createQuantityAnchoredText(
                          chart,
                          getAnchoredQuantityTextLocation(
                              chart,
                              line.xLoc,
                              line.textValue,
                          ),

                          line.yPrice,
                          quantityTextFormatWithComma(line.quantityTextValue),
                      )
                    : undefined;

                if (orderType === 'openOrder') {
                    cancelButtonTextId = await createCancelAnchoredText(
                        chart,
                        getAnchoredCancelButtonTextLocation(
                            chart,
                            line.xLoc,
                            line.textValue,
                            line.quantityTextValue
                                ? quantityTextFormatWithComma(
                                      line.quantityTextValue,
                                  )
                                : undefined,
                        ),
                        line.yPrice,
                    );
                }

                shapeRefs.push({
                    lineId,
                    textId,
                    quantityTextId,
                    cancelButtonTextId,
                });
            }

            orderLineItemsRef.current = shapeRefs;
            setOrderLineItems(shapeRefs);
        };

        if (lines.length !== 0 && chartReady) {
            cleanupShapes();
            setupShapes();
        }
    }, [chart, chartReady, lines.length]);

    useEffect(() => {
        let isCancelled = false;
        const intervals: number[] = [];

        const updateTextPosition = async () => {
            if (!chart || orderLineItems.length === 0 || lines.length === 0)
                return;

            orderLineItems.forEach((item, i) => {
                const lineData = lines[i];
                const { lineId, textId, quantityTextId, cancelButtonTextId } =
                    item;

                const interval = setInterval(() => {
                    if (isCancelled) return;

                    const pricePerPixel = priceToPixel(chart, lineData.yPrice);

                    const activeLabel = chart
                        .activeChart()
                        .getShapeById(textId);

                    if (activeLabel) {
                        const activeLabelText = formatLineLabel(
                            lineData.textValue,
                        );
                        activeLabel.setProperties({
                            text: activeLabelText,
                            wordWrapWidth: estimateTextWidth(activeLabelText),
                        });

                        activeLabel.setAnchoredPosition({
                            x: lineData.xLoc,
                            y: pricePerPixel,
                        });
                    }

                    if (quantityTextId && lineData.quantityTextValue) {
                        const activeQuantityLabel = chart
                            .activeChart()
                            .getShapeById(quantityTextId);
                        if (activeQuantityLabel) {
                            const quantityText = quantityTextFormatWithComma(
                                lineData.quantityTextValue,
                            );
                            activeQuantityLabel.setAnchoredPosition({
                                x: getAnchoredQuantityTextLocation(
                                    chart,
                                    lineData.xLoc,
                                    lineData.textValue,
                                ),
                                y: pricePerPixel,
                            });
                            activeQuantityLabel.setProperties({
                                text: quantityText,
                                wordWrapWidth:
                                    estimateTextWidth(quantityText) + 15,
                            });
                        }
                    }

                    if (cancelButtonTextId) {
                        const activeCancelButtonLabel = chart
                            .activeChart()
                            .getShapeById(cancelButtonTextId);

                        if (activeCancelButtonLabel) {
                            activeCancelButtonLabel.setAnchoredPosition({
                                x: getAnchoredCancelButtonTextLocation(
                                    chart,
                                    lineData.xLoc,
                                    lineData.textValue,
                                    lineData.quantityTextValue
                                        ? quantityTextFormatWithComma(
                                              lineData.quantityTextValue,
                                          )
                                        : undefined,
                                ),
                                y: pricePerPixel,
                            });
                        }
                    }

                    const activeLine = chart.activeChart().getShapeById(lineId);
                    if (activeLine) {
                        activeLine.setPoints([
                            { time: 10, price: lineData.yPrice },
                        ]);
                        activeLine.setProperties({
                            linecolor: lineData.color,
                            borderColor: lineData.color,
                        });
                    }
                }, 10) as unknown as number;

                intervals.push(interval);
            });
        };

        if (zoomChanged) {
            updateTextPosition();
        } else {
            intervals.forEach(clearInterval);
        }

        return () => {
            isCancelled = true;
            intervals.forEach(clearInterval);
        };
    }, [orderLineItems, chart, lines, zoomChanged]);

    useEffect(() => {
        const handleMouseDown = (params: any) => {
            if (chart) {
                const chartDiv = document.getElementById('tv_chart');
                const iframe = chartDiv?.querySelector(
                    'iframe',
                ) as HTMLIFrameElement;

                const iframeDoc = iframe.contentDocument;

                if (iframeDoc) {
                    const paneCanvas = iframeDoc.querySelector(
                        'canvas[data-name="pane-canvas"]',
                    );

                    const rect = paneCanvas?.getBoundingClientRect();

                    if (rect) {
                        const offsetX = params.clientX - rect.left;
                        const offsetY = params.clientY - rect.top;

                        for (let i = 0; i < orderLineItems.length; i++) {
                            const element = orderLineItems[i];
                            const lineData = lines[i];

                            const timeScale = chart
                                .activeChart()
                                .getTimeScale();
                            const chartWidth = Math.floor(timeScale.width());

                            const priceScalePane = chart
                                .activeChart()
                                .getPanes()[0] as IPaneApi;

                            const priceScale =
                                priceScalePane.getMainSourcePriceScale();
                            if (priceScale) {
                                const chartHeight = priceScalePane.getHeight();

                                const { cancelButtonTextId } = element;
                                if (cancelButtonTextId) {
                                    const activeCancelButtonLabel = chart
                                        .activeChart()
                                        .getShapeById(cancelButtonTextId);

                                    if (activeCancelButtonLabel) {
                                        const points =
                                            activeCancelButtonLabel.getAnchoredPosition();

                                        if (points) {
                                            const tempX = points.x * chartWidth;
                                            const tempY =
                                                points.y * chartHeight;

                                            const isClicked =
                                                isInsideTextBounds(
                                                    offsetX,
                                                    offsetY,
                                                    tempX,
                                                    tempY,
                                                );

                                            if (isClicked) {
                                                console.log(
                                                    lineData.textValue.type,
                                                    lineData.yPrice,
                                                );

                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        if (chart) {
            chart.subscribe('mouse_down', handleMouseDown);
        }
        return () => {
            if (chart) {
                chart.unsubscribe('mouse_down', handleMouseDown);
            }
        };
    }, [chart, JSON.stringify(orderLineItems)]);

    return null;
};

export default LineComponent;
