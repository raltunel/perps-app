import { useEffect, useRef, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import {
    getPaneCanvasAndIFrameDoc,
    getXandYLocationForChartDrag,
    getMainSeriesPaneIndex,
    scaleDataRef,
} from './overlayCanvasUtils';
import * as d3 from 'd3';
import type { IPaneApi } from '~/tv/charting_library';

const YAxisOverlayCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { chart, isChartReady } = useTradingView();
    const { orderInputPriceValue } = useTradeDataStore();
    const [isDrag, setIsDrag] = useState(false);
    const [mouseY, setMouseY] = useState(0);
    const [isPaneChanged, setIsPaneChanged] = useState(false);
    const isNearOrderPriceRef = useRef(false);
    const isInitialSizeSetRef = useRef(false);

    const { symbolInfo } = useTradeDataStore();

    const markPx = symbolInfo?.markPx || 1;

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

        const { iframeDoc, yAxisCanvas } = getPaneCanvasAndIFrameDoc(chart);
        if (!iframeDoc || !yAxisCanvas || !yAxisCanvas.parentNode) return;

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

        const resizeObserver = new ResizeObserver(() => {
            updateCanvasSize();
        });

        resizeObserver.observe(yAxisCanvas);

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
            resizeObserver.disconnect();
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

        if (!canvasRef.current || !chart || isDrag || !orderInputPriceValue)
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

        let markPixel: number;
        if (isLogarithmic) {
            orderPricePixel = scaleData.scaleSymlog(orderInputPriceValue);
            markPixel = scaleData.scaleSymlog(markPx);
        } else {
            orderPricePixel = scaleData.yScale(orderInputPriceValue);
            markPixel = scaleData.yScale(markPx);
        }

        // Approximate label height in pixels
        const labelHeight = 20 * dpr;

        // Check if markPixel and orderPricePixel are too close to each other
        const pixelDistance = Math.abs(markPixel - orderPricePixel);
        const areLabelsClose = pixelDistance <= labelHeight;

        // Adjust orderPricePixel for drag detection if labels are close
        // If order price is below mark price, shift down by label height
        // If order price is above mark price, shift up by label height
        let adjustedOrderPricePixel = orderPricePixel;
        if (areLabelsClose) {
            if (orderPricePixel > markPixel) {
                // Order price is below mark price (higher pixel value = lower on screen)
                adjustedOrderPricePixel = orderPricePixel + labelHeight;
            } else {
                // Order price is above mark price (lower pixel value = higher on screen)
                adjustedOrderPricePixel = orderPricePixel - labelHeight;
            }
        }

        const tolerance = 10 * dpr;
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
    }, [mouseY, orderInputPriceValue, chart, isDrag, markPx]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        let draggedPrice: number | undefined = undefined;
        let isDragging = false;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleDragStart = (event: any) => {
            draggedPrice = orderInputPriceValue;
            isDragging = true;
            setIsDrag(true);
            canvas.style.cursor = 'grabbing';
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
                useTradeDataStore
                    .getState()
                    .setOrderInputPriceValue(draggedPrice);
            }
        };

        const handleDragEnd = () => {
            if (!isDragging || draggedPrice === undefined) return;

            useTradeDataStore.getState().setOrderInputPriceValue(draggedPrice);

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
    }, [canvasRef.current, chart, orderInputPriceValue]);

    return null;
};

export default YAxisOverlayCanvas;
