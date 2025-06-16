import { useEffect } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import {
    formatLineLabel,
    getPricetoPixel,
    quantityTextFormatWithComma,
} from '../customOrderLineUtils';
import { drawLabel, type LabelType } from '../orderLineUtils';
import type { LineData } from './LineComponent';
import {
    findCancelLabelAtPosition,
    getXandYLocationForChartDrag,
    type LabelLocationData,
} from '../../overlayCanvas/overlayCanvasUtils';
import * as d3 from 'd3';

interface LabelProps {
    lines: LineData[];
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    zoomChanged: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasSize: any;
    drawnLabels: LineData[];
    setDrawnLabels: React.Dispatch<React.SetStateAction<LineData[]>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scaleData: any;
    selectedLine: LabelLocationData | undefined;
    setSelectedLine: React.Dispatch<
        React.SetStateAction<LabelLocationData | undefined>
    >;
}

const LabelComponent = ({
    lines,
    overlayCanvasRef,
    zoomChanged,
    canvasSize,
    drawnLabels,
    setDrawnLabels,
    scaleData,
    selectedLine,
    setSelectedLine,
}: LabelProps) => {
    const { chart, isChartReady } = useTradingView();

    const ctx = overlayCanvasRef.current?.getContext('2d');

    useEffect(() => {
        if (!chart || !isChartReady || !ctx) return;

        let animationFrameId: number | null = null;

        const draw = () => {
            let heightAttr = canvasSize?.height;
            let widthAttr = canvasSize.width;

            if (overlayCanvasRef.current) {
                const chartDiv = document.getElementById('tv_chart');
                const iframe = chartDiv?.querySelector(
                    'iframe',
                ) as HTMLIFrameElement;
                const iframeDoc =
                    iframe?.contentDocument || iframe?.contentWindow?.document;

                if (iframeDoc) {
                    const paneCanvas = iframeDoc.querySelector(
                        'canvas[data-name="pane-canvas"]',
                    ) as HTMLCanvasElement;
                    const width = overlayCanvasRef.current.style.width;
                    const height = overlayCanvasRef.current.style?.height;

                    heightAttr = paneCanvas?.height;
                    widthAttr = paneCanvas.width;

                    if (
                        width !== canvasSize.styleWidth ||
                        height !== canvasSize.styleWidth
                    ) {
                        overlayCanvasRef.current.style.width = `${canvasSize.styleWidth}px`;
                        overlayCanvasRef.current.style.height = `${canvasSize.styleHeight}px`;
                        overlayCanvasRef.current.width = paneCanvas.width;
                        overlayCanvasRef.current.height = paneCanvas.height;
                    }
                }
            }

            drawnLabels.map((i) => {
                const data = i.labelLocations;
                data?.forEach((item) => {
                    ctx.clearRect(item.x, item.y, item.width, item.height);
                });
            });

            const linesWithLabels = lines.map((line) => {
                const yPricePixel = getPricetoPixel(
                    chart,
                    line.yPrice,
                    heightAttr,
                ).pixel;

                const xPixel = widthAttr * line.xLoc;

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
                                  text: ' X ',
                                  backgroundColor: '#D1D1D1',
                                  textColor: '#3C91FF',
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
        selectedLine,
    ]);

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
                    ) as HTMLCanvasElement;

                    const rect = paneCanvas?.getBoundingClientRect();

                    if (rect && paneCanvas) {
                        const cssOffsetX = params.clientX - rect.left;
                        const cssOffsetY = params.clientY - rect.top;

                        const scaleY = paneCanvas?.height / rect?.height;
                        const scaleX = paneCanvas.width / rect.width;

                        const offsetX = cssOffsetX * scaleX;
                        const offsetY = cssOffsetY * scaleY;

                        const found = findCancelLabelAtPosition(
                            offsetX,
                            offsetY,
                            drawnLabels,
                            true,
                        );

                        const isLabel = findCancelLabelAtPosition(
                            offsetX,
                            offsetY,
                            drawnLabels,
                            false,
                        );

                        if (isLabel) {
                            if (overlayCanvasRef.current)
                                overlayCanvasRef.current.style.pointerEvents =
                                    'auto';
                            setSelectedLine(isLabel);

                            return;
                        } else {
                            if (overlayCanvasRef.current)
                                overlayCanvasRef.current.style.pointerEvents =
                                    'none';
                        }
                        if (found) {
                            console.log(found.parentLine.textValue);
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

    useEffect(() => {
        if (!overlayCanvasRef.current) return;
        if (selectedLine) {
            overlayCanvasRef.current.style.pointerEvents = 'auto';
        }

        const canvas = overlayCanvasRef.current;

        /*   // eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const handleDragStart = (/* event: any */) => {
            // const { x, y } = event;
            // const target = findCancelLabelAtPosition(x, y, drawnLabels, false);
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleDragging = (event: any) => {
            const { offsetY: clientY } = getXandYLocationForChartDrag(
                event,
                canvas.getBoundingClientRect(),
            );

            const advancedValue = scaleData?.yScale.invert(clientY);

            setSelectedLine((prev) =>
                prev
                    ? {
                          ...prev,
                          parentLine: {
                              ...prev.parentLine,
                              yPrice: advancedValue,
                          },
                      }
                    : undefined,
            );
        };

        const handleDragEnd = () => {
            if (overlayCanvasRef.current) {
                setSelectedLine(undefined);
                overlayCanvasRef.current.style.pointerEvents = 'none';
                // setIsDrag(false);
            }
        };

        const dragLines = d3
            .drag<d3.DraggedElementBaseType, unknown, d3.SubjectPosition>()
            .on('start', handleDragStart)
            .on('drag', handleDragging)
            .on('end', handleDragEnd)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((event: any) => {
                const isLabel = findCancelLabelAtPosition(
                    event.x,
                    event.y,
                    drawnLabels,
                    false,
                );
                return isLabel === null;
            });

        if (dragLines && canvas) {
            d3.select<d3.DraggedElementBaseType, unknown>(canvas).call(
                dragLines,
            );
        }
        return () => {
            d3.select(canvas).on('.drag', null);
        };
    }, [overlayCanvasRef.current, chart, drawnLabels, selectedLine]);

    return null;
};

export default LabelComponent;
