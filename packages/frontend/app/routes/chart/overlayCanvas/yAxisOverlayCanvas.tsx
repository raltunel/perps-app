import { useEffect, useRef, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import {
    getPaneCanvasAndIFrameDoc,
    getXandYLocationForChartDrag,
    getMainSeriesPaneIndex,
    scaleDataRef,
    mousePositionRef,
} from './overlayCanvasUtils';
import * as d3 from 'd3';
import type { IPaneApi } from '~/tv/charting_library';

const YAxisOverlayCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { chart, isChartReady } = useTradingView();
    const { orderInputPriceValue } = useTradeDataStore();
    const [isDrag, setIsDrag] = useState(false);
    const [mouseY, setMouseY] = useState(0);
    const isNearOrderPriceRef = useRef(false);

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

        const observer = new ResizeObserver(() => {
            updateCanvasSize();
        });

        observer.observe(yAxisCanvas);

        const handleCanvasMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const y = (e.clientY - rect.top) * dpr;
            mousePositionRef.current = {
                x: (e.clientX - rect.left) * dpr,
                y: y,
            };
            setMouseY(y);
        };

        const handleYAxisMouseMove = (e: MouseEvent) => {
            const rect = yAxisCanvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const y = (e.clientY - rect.top) * dpr;
            mousePositionRef.current = {
                x: (e.clientX - rect.left) * dpr,
                y: y,
            };
            setMouseY(y);
        };

        canvas.addEventListener('mousemove', handleCanvasMouseMove);
        yAxisCanvas.addEventListener('mousemove', handleYAxisMouseMove);

        return () => {
            observer.disconnect();
            canvas.removeEventListener('mousemove', handleCanvasMouseMove);
            yAxisCanvas.removeEventListener('mousemove', handleYAxisMouseMove);
            if (canvas?.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
            canvasRef.current = null;
        };
    }, [chart, isChartReady]);

    useEffect(() => {
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

        if (isLogarithmic) {
            orderPricePixel = scaleData.scaleSymlog(orderInputPriceValue);
        } else {
            orderPricePixel = scaleData.yScale(orderInputPriceValue);
        }

        const tolerance = 10;
        const isNearOrderPrice =
            Math.abs(mouseY - orderPricePixel) <= tolerance;

        isNearOrderPriceRef.current = isNearOrderPrice;

        if (isNearOrderPrice) {
            canvas.style.cursor = 'ns-resize';
            canvas.style.pointerEvents = 'auto';
        } else {
            canvas.style.cursor = 'default';
            canvas.style.pointerEvents = 'none';
        }
    }, [mouseY, orderInputPriceValue, chart, isDrag]);

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
