import React, { useEffect, useState } from 'react';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useTradingView } from '~/contexts/TradingviewContext';
import {
    getPricetoPixel,
    updateOverlayCanvasSize,
} from '../orders/customOrderLineUtils';
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
    overlayCanvasMousePositionRef,
}) => {
    const [clickedPrice, setClickedPrice] = useState<number | null>(null);
    const [clickedMousePos, setClickedMousePos] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [mousePrice, setMousePrice] = useState<number | null>(null);
    const { getBsColor } = useAppSettings();
    const colors = getBsColor();
    const { symbolInfo } = useTradeDataStore();
    const markPx = symbolInfo?.markPx;
    const { chart, isChartReady } = useTradingView();

    // Listen for crosshair movement to track price
    useEffect(() => {
        if (!chart || !scaleData) return;

        chart
            .activeChart()
            .crossHairMoved()
            .subscribe(null, ({ offsetX, offsetY, price }) => {
                if (!chart || !scaleData) return;

                const { paneCanvas } = getPaneCanvasAndIFrameDoc(chart);

                if (!paneCanvas || !offsetX || !offsetY) {
                    setMousePrice(null);
                    return;
                }

                const rect = paneCanvas.getBoundingClientRect();

                if (!rect) return;

                const cssOffsetX = offsetX - rect.left;
                const cssOffsetY = offsetY - rect.top;

                const scaleY = paneCanvas.height / rect.height;
                const scaleX = paneCanvas.width / rect.width;

                const overlayOffsetX = cssOffsetX * scaleX;
                const overlayOffsetY = cssOffsetY * scaleY;

                overlayCanvasMousePositionRef.current = {
                    x: overlayOffsetX,
                    y: overlayOffsetY,
                };

                setMousePrice(price);
            });
    }, [chart, scaleData, overlayCanvasMousePositionRef]);

    // Listen for clicks on TradingView chart
    useEffect(() => {
        if (!chart || !scaleData || !overlayCanvasRef.current) return;

        const { iframeDoc } = getPaneCanvasAndIFrameDoc(chart);
        if (!iframeDoc) return;

        const handleChartClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (target.tagName !== 'CANVAS') return;

            const canvas = overlayCanvasRef.current;
            if (!canvas) return;

            const dpr = window.devicePixelRatio || 1;

            const y = e.clientY - canvas.getBoundingClientRect().top;

            const price = scaleData.yScale.invert(y);

            setClickedPrice(mousePrice);
            // Save mouse position at click time
            setClickedMousePos({
                x: e.offsetX * dpr,
                y: e.offsetY * dpr,
            });

            console.log('Limit order placement at price:', price);
        };

        iframeDoc.addEventListener('click', handleChartClick);

        return () => {
            iframeDoc.removeEventListener('click', handleChartClick);
        };
    }, [
        chart,
        JSON.stringify(scaleData?.yScale.domain()),
        overlayCanvasRef,
        mousePrice,
    ]);

    useEffect(() => {
        if (!chart || !isChartReady || !canvasSize) return;
        if (!mousePrice && !clickedPrice) return;

        let animationFrameId: number | null = null;

        const draw = () => {
            let heightAttr = canvasSize?.height;
            if (overlayCanvasRef.current) {
                if (overlayCanvasRef.current) {
                    updateOverlayCanvasSize(
                        overlayCanvasRef.current,
                        canvasSize,
                    );
                }
                const canvas = overlayCanvasRef.current;

                const { iframeDoc, paneCanvas } =
                    getPaneCanvasAndIFrameDoc(chart);

                if (!iframeDoc || !paneCanvas || !paneCanvas.parentNode) return;

                const width = overlayCanvasRef.current.style.width;
                const height = overlayCanvasRef.current.style?.height;

                heightAttr = paneCanvas?.height;
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

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Helper function to draw line at price
                const drawLineAtPrice = (price: number, isClicked: boolean) => {
                    const { pixel, chartHeight } = getPricetoPixel(
                        chart,
                        price,
                        'LIMIT',
                        heightAttr,
                        scaleData,
                    );

                    if (!chartHeight || chartHeight === 0) return;

                    const yPos = pixel;

                    if (isClicked) {
                        // Draw price label box at click position (if available)
                        const labelWidth = 100;
                        const labelHeight = 24;

                        // Clicked line - show in buy/sell color
                        const side: 'buy' | 'sell' =
                            markPx && price > markPx ? 'sell' : 'buy';
                        const lineColor =
                            side === 'buy' ? colors.buy : colors.sell;
                        let labelX: number;
                        let labelY: number;
                        if (clickedMousePos) {
                            const clickX = clickedMousePos.x;
                            const clickY = clickedMousePos.y;

                            ctx.strokeStyle = lineColor;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath();
                            ctx.moveTo(0, clickY);
                            ctx.lineTo(canvas.width, clickY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            labelX = clickX + 15;
                            labelY = clickY - labelHeight / 2;

                            if (labelX + labelWidth > canvas.width) {
                                labelX = clickX - labelWidth - 15;
                            }
                        } else {
                            labelX = canvas.width - labelWidth;
                            labelY = yPos - labelHeight / 2;
                        }

                        ctx.fillStyle = lineColor;
                        ctx.fillRect(labelX, labelY, labelWidth, labelHeight);

                        // Draw price text
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '12px monospace';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(
                            price.toFixed(5),
                            labelX + labelWidth / 2,
                            labelY + labelHeight / 2,
                        );
                    } else {
                        // Mouse hover - only show label (no line)
                        const labelWidth = 100;
                        const labelHeight = 24;

                        // Determine side based on mark price
                        const side: 'buy' | 'sell' =
                            markPx && price > markPx ? 'sell' : 'buy';
                        const labelColor =
                            side === 'buy' ? colors.buy : colors.sell;

                        // Position label next to mouse cursor
                        const mouseX = overlayCanvasMousePositionRef.current.x;
                        const mouseY = overlayCanvasMousePositionRef.current.y;

                        // Offset label to the right, vertically centered on cursor
                        let labelX = mouseX + 15;
                        const labelY = mouseY - labelHeight / 2;

                        // Prevent label from going off screen
                        if (labelX + labelWidth > canvas.width) {
                            labelX = mouseX - labelWidth - 15; // Show on left side if no room on right
                        }

                        ctx.fillStyle = labelColor;
                        ctx.fillRect(labelX, labelY, labelWidth, labelHeight);

                        // Draw price text
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '12px monospace';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(
                            price.toFixed(5),
                            labelX + labelWidth / 2,
                            labelY + labelHeight / 2,
                        );
                    }
                };

                // Draw clicked price line first (if exists)
                if (clickedPrice) {
                    drawLineAtPrice(clickedPrice, true);
                }

                // Draw mouse hover line (if exists and different from clicked)
                if (mousePrice && mousePrice !== clickedPrice) {
                    drawLineAtPrice(mousePrice, false);
                }
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
    }, [
        chart,
        zoomChanged,
        clickedPrice,
        clickedMousePos,
        mousePrice,
        colors,
        markPx,
        scaleData,
        canvasSize,
        isChartReady,
        overlayCanvasMousePositionRef,
    ]);

    return null;
};

export default LimitOrderPlacement;
