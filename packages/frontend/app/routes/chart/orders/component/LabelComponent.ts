import { useEffect, useState } from 'react';
import type { LineData } from './LineComponent';
import { useTradingView } from '~/contexts/TradingviewContext';
import {
    drawLabel,
    type LabelLocation,
    type LabelType,
} from '../orderLineUtils';
import {
    formatLineLabel,
    getPricetoPixel,
    quantityTextFormatWithComma,
} from '../customOrderLineUtils';

interface LabelProps {
    lines: LineData[];
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    zoomChanged: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasSize: any;
}

const LabelComponent = ({
    lines,
    overlayCanvasRef,
    zoomChanged,
    canvasSize,
}: LabelProps) => {
    const { chart, isChartReady } = useTradingView();

    const ctx = overlayCanvasRef.current?.getContext('2d');

    const [drawnLabels, setDrawnLabels] = useState<LineData[]>([]);

    useEffect(() => {
        if (!chart || !isChartReady || !ctx) return;

        let animationFrameId: number | null = null;

        const draw = () => {
            if (overlayCanvasRef.current) {
                const width = overlayCanvasRef.current.width;
                const height = overlayCanvasRef.current.height;

                if (
                    width !== canvasSize[0].contentRect.width ||
                    height !== canvasSize[0].contentRect.height
                ) {
                    overlayCanvasRef.current.width =
                        canvasSize[0].contentRect.width;
                    overlayCanvasRef.current.height =
                        canvasSize[0].contentRect.height;
                }
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            const linesWithLabels = lines.map((line) => {
                const yPricePixel = getPricetoPixel(chart, line.yPrice).pixel;
                const timeScale = chart.activeChart().getTimeScale();
                const chartWidth = Math.floor(timeScale.width());
                const xPixel = chartWidth * line.xLoc;

                const labelOptions = [
                    {
                        type: 'Main' as LabelType,
                        text: formatLineLabel(line.textValue),
                        backgroundColor: '#D1D1D1',
                        textColor: '#3C91FF',
                        borderColor: line.color,
                    },
                    ...(line.quantityTextValue
                        ? [
                              {
                                  type: 'Quantity' as LabelType,
                                  text: quantityTextFormatWithComma(
                                      line.quantityTextValue,
                                  ),
                                  backgroundColor: '#000000',
                                  textColor: '#FFFFFF',
                                  borderColor: '#3C91FF',
                              },
                          ]
                        : []),
                    ...(line.type === 'LIMIT'
                        ? [
                              {
                                  type: 'Cancel' as LabelType,
                                  text: 'X',
                                  backgroundColor: '#000000',
                                  textColor: '#FFFFFF',
                                  borderColor: '#3C91FF',
                              },
                          ]
                        : []),
                ];

                const labelLocations = drawLabel(ctx, {
                    x: xPixel,
                    y: yPricePixel,
                    labelOptions,
                });

                return {
                    ...line,
                    labelLocations,
                };
            });

            setDrawnLabels(linesWithLabels);
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
        isChartReady,
        JSON.stringify(lines),
        ctx,
        zoomChanged,
        canvasSize,
    ]);

    function findCancelLabelAtPosition(
        x: number,
        y: number,
        drawnLabels: LineData[],
    ): { label: LabelLocation; parentLine: (typeof drawnLabels)[0] } | null {
        for (let i = drawnLabels.length - 1; i >= 0; i--) {
            const labelLocs = drawnLabels[i].labelLocations;
            if (!labelLocs) continue;

            for (const loc of labelLocs) {
                if (loc.type === 'Cancel') {
                    const startX = loc.x;
                    const endX = loc.x + loc.width;
                    const startY = loc.y;
                    const endY = loc.y + loc.height;

                    if (x >= startX && x <= endX && y >= startY && y <= endY) {
                        return { label: loc, parentLine: drawnLabels[i] };
                    }
                }
            }
        }
        return null;
    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

                        const found = findCancelLabelAtPosition(
                            offsetX,
                            offsetY,
                            drawnLabels,
                        );

                        if (found) {
                            console.log(found.parentLine);
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
                try {
                    chart.unsubscribe('mouse_down', handleMouseDown);

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error: unknown) {
                    // console.error({ error });
                }
            }
        };
    }, [chart, JSON.stringify(drawnLabels)]);

    return null;
};

export default LabelComponent;
