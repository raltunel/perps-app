import React, { useEffect, useState } from 'react';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useTradingView } from '~/contexts/TradingviewContext';
import {
    getPricetoPixel,
    updateOverlayCanvasSize,
} from '../orders/customOrderLineUtils';
import { getPaneCanvasAndIFrameDoc } from './overlayCanvasUtils';
import { tempPendingOrders } from '../orders/useOpenOrderLines';
import type { LineData } from '../orders/component/LineComponent';

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
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
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

                setMousePrice(parseFloat(price.toFixed(3)));
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
            setIsProcessing(true);
            setProcessingProgress(0);

            console.log('Limit order placement at price:', price);

            const side: 'buy' | 'sell' =
                markPx && mousePrice && mousePrice > markPx ? 'sell' : 'buy';

            const startTime = Date.now();
            const duration = 3000;

            const animateProgress = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                setProcessingProgress(progress);

                if (progress < 1) {
                    requestAnimationFrame(animateProgress);
                } else {
                    setTimeout(() => {
                        setClickedPrice(null);
                        setClickedMousePos(null);
                        setIsProcessing(false);
                        setProcessingProgress(0);

                        if (mousePrice) {
                            const randomQuantity = +(0).toFixed(2);

                            const newPendingOrder: LineData = {
                                xLoc: 0.4,
                                yPrice: mousePrice,
                                textValue: {
                                    type: 'Limit',
                                    price: mousePrice,
                                    triggerCondition: '',
                                },
                                quantityTextValue: randomQuantity,
                                quantityText: randomQuantity.toString(),
                                color: colors[side],
                                type: 'LIMIT',
                                lineStyle: 3,
                                lineWidth: 1,
                                side: side,
                            };

                            tempPendingOrders.push(newPendingOrder);
                            // Force re-render by triggering the hook dependency
                            window.dispatchEvent(
                                new Event('pendingOrdersChanged'),
                            );
                        }
                    }, 100);
                }
            };

            requestAnimationFrame(animateProgress);
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

                            // Draw line with blinking effect when processing
                            if (isProcessing) {
                                // Create blinking effect - fade in and out (4 cycles over 5 seconds)
                                const blinkProgress =
                                    Math.sin(processingProgress * Math.PI * 8) *
                                        0.5 +
                                    0.5;
                                const alpha = 0.4 + blinkProgress * 0.6; // Oscillate between 0.4 and 1.0

                                // Draw main line
                                ctx.strokeStyle = lineColor;
                                ctx.lineWidth = 4;
                                ctx.setLineDash([8, 6]);
                                ctx.globalAlpha = alpha;
                                ctx.beginPath();
                                ctx.moveTo(0, clickY);
                                ctx.lineTo(canvas.width, clickY);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.globalAlpha = 1.0;

                                // Add a subtle glow effect
                                ctx.strokeStyle = lineColor;
                                ctx.lineWidth = 6;
                                ctx.globalAlpha = alpha * 0.3;
                                ctx.beginPath();
                                ctx.moveTo(0, clickY);
                                ctx.lineTo(canvas.width, clickY);
                                ctx.stroke();
                                ctx.globalAlpha = 1.0;
                            } else {
                                // Draw full line normally
                                ctx.strokeStyle = lineColor;
                                ctx.lineWidth = 4;
                                ctx.setLineDash([8, 6]);
                                ctx.beginPath();
                                ctx.moveTo(0, clickY);
                                ctx.lineTo(canvas.width, clickY);
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

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
        isProcessing,
        processingProgress,
    ]);

    return null;
};

export default LimitOrderPlacement;
