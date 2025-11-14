import React, { useEffect, useState } from 'react';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useTradingView } from '~/contexts/TradingviewContext';
import { getPricetoPixel } from '../orders/customOrderLineUtils';
import { getPaneCanvasAndIFrameDoc } from './overlayCanvasUtils';

interface LimitOrderPlacementProps {
    overlayCanvasRef: React.RefObject<HTMLCanvasElement | null>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasSize: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scaleData: any;
    overlayCanvasMousePositionRef: React.MutableRefObject<{
        x: number;
        y: number;
    }>;
    zoomChanged: boolean;
}

const LimitOrderPlacement: React.FC<LimitOrderPlacementProps> = ({
    overlayCanvasRef,
    scaleData,
    canvasSize,
    zoomChanged,
}) => {
    const [clickedPrice, setClickedPrice] = useState<number | null>(null);
    const { getBsColor } = useAppSettings();
    const colors = getBsColor();
    const { symbolInfo } = useTradeDataStore();
    const markPx = symbolInfo?.markPx;
    const { chart, isChartReady } = useTradingView();

    // Listen for clicks on TradingView chart
    useEffect(() => {
        if (!chart || !scaleData || !overlayCanvasRef.current) return;

        const { iframeDoc } = getPaneCanvasAndIFrameDoc(chart);
        if (!iframeDoc) return;

        const handleChartClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Only handle clicks on canvas elements (not UI buttons/menus)
            if (target.tagName !== 'CANVAS') return;

            const canvas = overlayCanvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const y = (e.clientY - rect.top) * dpr;

            // Convert Y coordinate to price
            const yScale = scaleData.yScale;
            const price = yScale.invert(y);

            setClickedPrice(price);

            console.log('📍 Limit order placement at price:', price);

            // TODO: Trigger order modal or execute order
            // handleChartBuy(price) or handleChartSell(price)
        };

        iframeDoc.addEventListener('click', handleChartClick);

        return () => {
            iframeDoc.removeEventListener('click', handleChartClick);
        };
    }, [chart, scaleData, overlayCanvasRef]);

    // Draw horizontal line at clicked price
    useEffect(() => {
        console.log({ clickedPrice });

        let animationFrameId: number | null = null;

        const draw = () => {};

        // Use requestAnimationFrame during zoom, otherwise draw once
        if (zoomChanged && animationFrameId === null) {
            const animate = () => {
                draw();
                animationFrameId = requestAnimationFrame(animate);
            };
            animationFrameId = requestAnimationFrame(animate);
        } else {
            draw();
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [
        overlayCanvasRef,
        clickedPrice,
        colors,
        markPx,
        chart,
        scaleData,
        zoomChanged,
    ]);

    useEffect(() => {
        if (!chart || !isChartReady || !canvasSize || !clickedPrice) return;

        let animationFrameId: number | null = null;

        const draw = () => {
            if (overlayCanvasRef.current) {
                const canvas = overlayCanvasRef.current;

                const { iframeDoc, paneCanvas } =
                    getPaneCanvasAndIFrameDoc(chart);

                if (!iframeDoc || !paneCanvas || !paneCanvas.parentNode) return;

                const width = overlayCanvasRef.current.style.width;
                const height = overlayCanvasRef.current.style?.height;

                if (
                    width !== canvasSize?.styleWidth ||
                    height !== canvasSize?.styleWidth
                ) {
                    overlayCanvasRef.current.style.width = `${canvasSize?.styleWidth}px`;
                    overlayCanvasRef.current.style.height = `${canvasSize?.styleHeight}px`;
                    overlayCanvasRef.current.width = paneCanvas.width;
                    overlayCanvasRef.current.height = paneCanvas.height;
                }

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const { pixel, chartHeight } = getPricetoPixel(
                    chart,
                    clickedPrice,
                    'LIMIT',
                    undefined,
                    scaleData,
                );

                if (!chartHeight || chartHeight === 0) return;

                // Convert to actual Y coordinate on canvas
                const yPos = pixel;

                // Clear and redraw
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Determine side based on mark price
                // If clicked price is above mark price -> sell
                // If clicked price is below mark price -> buy
                const side: 'buy' | 'sell' =
                    markPx && clickedPrice > markPx ? 'sell' : 'buy';

                // Get color based on side (buy or sell)
                const lineColor = side === 'buy' ? colors.buy : colors.sell;

                // Draw dashed horizontal line
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(0, yPos);
                ctx.lineTo(canvas.width, yPos);
                ctx.stroke();
                ctx.setLineDash([]);

                // Draw price label box
                const labelWidth = 100;
                const labelHeight = 24;
                const labelX = canvas.width - labelWidth;
                const labelY = yPos - labelHeight / 2;

                ctx.fillStyle = lineColor;
                ctx.fillRect(labelX, labelY, labelWidth, labelHeight);

                // Draw price text
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                console.log(
                    '  clickedPrice.toFixed(5),',
                    clickedPrice.toFixed(5),
                );

                ctx.fillText(
                    clickedPrice.toFixed(5),
                    labelX + labelWidth / 2,
                    yPos,
                );
            }
        };

        if (zoomChanged && animationFrameId === null) {
            if (animationFrameId === null) {
                const animate = () => {
                    draw();
                    animationFrameId = requestAnimationFrame(animate);
                };
                animationFrameId = requestAnimationFrame(animate);
            }
        } else {
            draw();
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [chart, zoomChanged, clickedPrice]);

    return null;
};

export default LimitOrderPlacement;
