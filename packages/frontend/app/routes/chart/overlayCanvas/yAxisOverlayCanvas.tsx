import { useEffect, useRef, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import {
    getXandYLocationForChartDrag,
    getMainSeriesPaneIndex,
    scaleDataRef,
    getPriceAxisContainer,
} from './overlayCanvasUtils';
import * as d3 from 'd3';
import type { IPaneApi } from '~/tv/charting_library';
import { getLastCandleClosePrice } from '../data/candleDataCache';
import { usePreviewOrderLines } from '../orders/usePreviewOrderLines';

const YAxisOverlayCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { chart, isChartReady } = useTradingView();
    const { orderInputPriceValue, symbol } = useTradeDataStore();
    const [isDrag, setIsDrag] = useState(false);
    const [mouseY, setMouseY] = useState(0);
    const [isPaneChanged, setIsPaneChanged] = useState(false);
    const isNearOrderPriceRef = useRef(false);
    const isInitialSizeSetRef = useRef(false);
    const { updateYPosition } = usePreviewOrderLines();
    useEffect(() => {
        if (!chart) return;

        const unsubscribe = chart.subscribe('panes_order_changed', () => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.clearRect(
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height,
                    );
                }
            }
            isInitialSizeSetRef.current = false;
            setIsPaneChanged((prev) => !prev);
        }) as unknown as () => void;

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [chart]);

    useEffect(() => {
        if (!chart || !isChartReady) return;

        const { iframeDoc, yAxisCanvas, priceAxisContainers } =
            getPriceAxisContainer(chart);
        if (
            !iframeDoc ||
            !yAxisCanvas ||
            !yAxisCanvas.parentNode ||
            !priceAxisContainers
        )
            return;

        if (!canvasRef.current) {
            const newCanvas = iframeDoc.createElement('canvas');
            newCanvas.id = 'y-overlay';
            newCanvas.style.position = 'absolute';
            newCanvas.style.top = '0';
            newCanvas.style.left = '0';
            newCanvas.style.cursor = 'default';
            newCanvas.style.pointerEvents = 'none';
            newCanvas.style.zIndex = '5555';
            newCanvas.width = yAxisCanvas.width;
            newCanvas.height = yAxisCanvas.height;
            yAxisCanvas.parentNode.appendChild(newCanvas);
            canvasRef.current = newCanvas;
        }

        const canvas = canvasRef.current;

        const updateCanvasSize = () => {
            canvas.width = yAxisCanvas.width;
            canvas.style.width = `${yAxisCanvas.width}px`;
            canvas.height = yAxisCanvas.height;
            canvas.style.height = `${yAxisCanvas.height}px`;
        };

        updateCanvasSize();

        const yAxisResizeObserver = new ResizeObserver(() => {
            updateCanvasSize();
        });

        yAxisResizeObserver.observe(yAxisCanvas);

        const containerWidths = new Map<HTMLElement, number>();
        priceAxisContainers.forEach((container) => {
            containerWidths.set(
                container,
                container.getBoundingClientRect().width,
            );
        });

        const priceAxisResizeObserver = new ResizeObserver((entries) => {
            let positionChanged = false;

            for (const entry of entries) {
                const container = entry.target as HTMLElement;
                const newWidth = entry.contentRect.width;
                const oldWidth = containerWidths.get(container) || 0;

                // Check if width changed between 0 and non-zero (position shift)
                if (
                    (oldWidth === 0 && newWidth > 0) ||
                    (oldWidth > 0 && newWidth === 0)
                ) {
                    positionChanged = true;
                }

                containerWidths.set(container, newWidth);
            }

            if (positionChanged) {
                if (canvas?.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
                canvasRef.current = null;
                isInitialSizeSetRef.current = false;
                setIsPaneChanged((prev) => !prev);
            }
        });

        priceAxisContainers.forEach((container) => {
            priceAxisResizeObserver.observe(container);
        });

        const ensureCanvasSize = () => {
            if (!isInitialSizeSetRef.current) {
                const yAxisRect = yAxisCanvas.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();

                // Check if canvas position needs updating
                if (
                    yAxisRect.left !== canvasRect.left ||
                    yAxisRect.top !== canvasRect.top
                ) {
                    canvas.style.left = '0';
                    canvas.style.top = '0';
                }

                // Check if canvas size needs updating
                const styleWidth = canvas.style.width;
                const styleHeight = canvas.style.height;

                if (
                    styleWidth !== yAxisCanvas.style.width ||
                    styleHeight !== yAxisCanvas.style.height
                ) {
                    canvas.style.width = yAxisCanvas.style.width;
                    canvas.style.height = yAxisCanvas.style.height;
                    yAxisCanvas.width = canvas.width;
                    yAxisCanvas.height = canvas.height;
                }

                isInitialSizeSetRef.current = true;
            }
        };

        const handleCanvasMouseMove = (e: MouseEvent) => {
            ensureCanvasSize();

            const rect = canvas.getBoundingClientRect();
            const y = e.clientY - rect.top;

            setMouseY(y);
        };

        const handleYAxisMouseMove = (e: MouseEvent) => {
            ensureCanvasSize();

            const rect = yAxisCanvas.getBoundingClientRect();
            const y = e.clientY - rect.top;

            setMouseY(y);
        };

        const handleMouseOut = () => {
            useTradeDataStore.getState().setIsPreviewOrderHovered(false);
        };

        canvas.addEventListener('mousemove', handleCanvasMouseMove);
        yAxisCanvas.addEventListener('mousemove', handleYAxisMouseMove);
        canvas.addEventListener('mouseout', handleMouseOut);
        yAxisCanvas.addEventListener('mouseout', handleMouseOut);

        return () => {
            yAxisResizeObserver.disconnect();
            priceAxisResizeObserver.disconnect();
            canvas.removeEventListener('mousemove', handleCanvasMouseMove);
            yAxisCanvas.removeEventListener('mousemove', handleYAxisMouseMove);
            canvas.removeEventListener('mouseout', handleMouseOut);
            yAxisCanvas.removeEventListener('mouseout', handleMouseOut);
            if (canvas?.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
            canvasRef.current = null;
            isInitialSizeSetRef.current = false;
        };
    }, [chart, isChartReady, isPaneChanged]);

    useEffect(() => {
        const dpr = window.devicePixelRatio || 1;

        if (
            !canvasRef.current ||
            !chart ||
            isDrag ||
            !orderInputPriceValue.value
        )
            return;

        const canvas = canvasRef.current;

        const scaleData = scaleDataRef.current;
        if (!scaleData) return;

        const paneIndex = getMainSeriesPaneIndex(chart);
        if (paneIndex === null) return;

        const priceScalePane = chart.activeChart().getPanes()[
            paneIndex
        ] as IPaneApi;
        const priceScale = priceScalePane.getMainSourcePriceScale();

        if (!priceScale) return;

        const isLogarithmic = priceScale.getMode() === 1;
        let orderPricePixel: number;

        // Get last candle close price from cache
        const resolution = chart.activeChart().resolution();
        const lastCandleClose = getLastCandleClosePrice(symbol, resolution);
        const closePrice = lastCandleClose || 1;

        let closePricePixel: number;
        if (isLogarithmic) {
            orderPricePixel = scaleData.scaleSymlog(orderInputPriceValue.value);
            closePricePixel = scaleData.scaleSymlog(closePrice);
        } else {
            orderPricePixel = scaleData.yScale(orderInputPriceValue.value);
            closePricePixel = scaleData.yScale(closePrice);
        }

        // Approximate label height in pixels
        const labelHeight = 15;

        // Check if closePricePixel and orderPricePixel are too close to each other
        const pixelDistance = Math.abs(closePricePixel - orderPricePixel);
        const areLabelsClose = pixelDistance <= labelHeight;

        let adjustedOrderPricePixel = orderPricePixel;
        if (areLabelsClose) {
            if (orderInputPriceValue.value >= closePrice) {
                adjustedOrderPricePixel =
                    orderPricePixel - (labelHeight - pixelDistance);
            } else {
                adjustedOrderPricePixel =
                    orderPricePixel + (labelHeight - pixelDistance);
            }
        }

        const tolerance = 10;
        const isNearOrderPrice =
            Math.abs(mouseY - adjustedOrderPricePixel) <= tolerance;

        isNearOrderPriceRef.current = isNearOrderPrice;

        useTradeDataStore.getState().setIsPreviewOrderHovered(isNearOrderPrice);

        if (isNearOrderPrice) {
            canvas.style.cursor = 'grab';
            canvas.style.pointerEvents = 'auto';
        } else {
            canvas.style.cursor = 'default';
            canvas.style.pointerEvents = 'none';
        }
    }, [mouseY, orderInputPriceValue.value, chart, isDrag, symbol]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        let draggedPrice: number | undefined = undefined;
        let isDragging = false;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleDragStart = (event: any) => {
            draggedPrice = orderInputPriceValue.value;
            isDragging = true;
            setIsDrag(true);
            canvas.style.cursor = 'grabbing';
            useTradeDataStore.getState().setIsMidModeActive(false);
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleDragging = (event: any) => {
            if (!isDragging) return;

            const { offsetY: clientY } = getXandYLocationForChartDrag(
                event,
                canvas.getBoundingClientRect(),
            );

            const scaleData = scaleDataRef.current;
            if (!scaleData) return;

            let newPrice = scaleData.yScale.invert(clientY);

            if (chart) {
                const paneIndex = getMainSeriesPaneIndex(chart);
                if (paneIndex === null) return;

                const priceScalePane = chart.activeChart().getPanes()[
                    paneIndex
                ] as IPaneApi;
                const priceScale = priceScalePane.getMainSourcePriceScale();

                if (priceScale?.getMode() === 1) {
                    newPrice = scaleData.scaleSymlog.invert(clientY);
                }
            }

            draggedPrice = newPrice;

            if (draggedPrice !== undefined) {
                updateYPosition(draggedPrice);
            }
        };

        const handleDragEnd = () => {
            if (!isDragging || draggedPrice === undefined) return;

            useTradeDataStore.getState().setOrderInputPriceValue({
                value: draggedPrice,
                changeType: 'dragEnd',
            });

            isDragging = false;
            draggedPrice = undefined;
            setIsDrag(false);
            canvas.style.cursor = 'grab';
        };

        const dragLines = d3
            .drag<d3.DraggedElementBaseType, unknown, d3.SubjectPosition>()
            .filter(() => {
                return isNearOrderPriceRef.current;
            })
            .on('start', handleDragStart)
            .on('drag', handleDragging)
            .on('end', handleDragEnd);

        if (dragLines && canvas) {
            d3.select<d3.DraggedElementBaseType, unknown>(canvas).call(
                dragLines,
            );
        }
        return () => {
            d3.select(canvas).on('.drag', null);
        };
    }, [canvasRef.current, chart, orderInputPriceValue.value, updateYPosition]);

    return null;
};

export default YAxisOverlayCanvas;
