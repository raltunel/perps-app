import { useEffect, useState } from 'react';
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
    // drawnLabels: LineData[];
    // setDrawnLabels: React.Dispatch<React.SetStateAction<LineData[]>>;
    drawnLabelsRef: React.MutableRefObject<LineData[]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scaleData: any;
    selectedLine: LabelLocationData | undefined;
    setSelectedLine: React.Dispatch<
        React.SetStateAction<LabelLocationData | undefined>
    >;
    overlayCanvasMousePositionRef: React.MutableRefObject<{
        x: number;
        y: number;
    }>;
}

const LabelComponent = ({
    lines,
    overlayCanvasRef,
    zoomChanged,
    canvasSize,
    drawnLabelsRef,
    scaleData,
    selectedLine,
    setSelectedLine,
    overlayCanvasMousePositionRef,
}: LabelProps) => {
    const { chart, isChartReady } = useTradingView();

    const ctx = overlayCanvasRef.current?.getContext('2d');

    const [isDrag, setIsDrag] = useState(false);
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

            drawnLabelsRef.current.map((i) => {
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

            drawnLabelsRef.current = linesWithLabels;
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
        const overlayOffsetX = overlayCanvasMousePositionRef.current.x;
        const overlayOffsetY = overlayCanvasMousePositionRef.current.y;

        const isCancel = findCancelLabelAtPosition(
            overlayOffsetX,
            overlayOffsetY,
            drawnLabelsRef.current,
            true,
        );

        const isLabel = findCancelLabelAtPosition(
            overlayOffsetX,
            overlayOffsetY,
            drawnLabelsRef.current,
            false,
        );

        if (isCancel || (!isLabel && !isDrag)) {
            if (overlayCanvasRef.current)
                overlayCanvasRef.current.style.pointerEvents = 'none';
        }
    }, [
        overlayCanvasMousePositionRef.current,
        selectedLine,
        JSON.stringify(drawnLabelsRef.current),
        isDrag,
    ]);

    useEffect(() => {
        if (chart && !isDrag) {
            chart.onChartReady(() => {
                chart
                    .activeChart()
                    .crossHairMoved()
                    .subscribe(null, ({ offsetX, offsetY }) => {
                        if (chart) {
                            const chartDiv =
                                document.getElementById('tv_chart');
                            const iframe = chartDiv?.querySelector(
                                'iframe',
                            ) as HTMLIFrameElement;

                            const iframeDoc = iframe.contentDocument;

                            if (iframeDoc) {
                                const paneCanvas = iframeDoc.querySelector(
                                    'canvas[data-name="pane-canvas"]',
                                ) as HTMLCanvasElement;

                                const rect =
                                    paneCanvas?.getBoundingClientRect();

                                if (rect && paneCanvas && offsetX && offsetY) {
                                    const cssOffsetX = offsetX - rect.left;
                                    const cssOffsetY = offsetY - rect.top;

                                    const scaleY =
                                        paneCanvas?.height / rect?.height;
                                    const scaleX =
                                        paneCanvas.width / rect.width;

                                    const overlayOffsetX = cssOffsetX * scaleX;
                                    const overlayOffsetY = cssOffsetY * scaleY;

                                    const isLabel = findCancelLabelAtPosition(
                                        overlayOffsetX,
                                        overlayOffsetY,
                                        drawnLabelsRef.current,
                                        false,
                                    );

                                    if (isLabel) {
                                        setSelectedLine(isLabel);

                                        if (overlayCanvasRef.current)
                                            overlayCanvasRef.current.style.pointerEvents =
                                                'auto';
                                    } else {
                                        setSelectedLine(undefined);
                                    }
                                }
                            }
                        }
                    });
            });
        }
    }, [chart, drawnLabelsRef.current, isDrag]);

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
                            drawnLabelsRef.current,
                            true,
                        );

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
    }, [chart, JSON.stringify(drawnLabelsRef.current)]);

    useEffect(() => {
        if (!overlayCanvasRef.current) return;

        const canvas = overlayCanvasRef.current;

        /*   // eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const handleDragStart = (/* event: any */) => {
            setIsDrag(true);
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
            setSelectedLine(undefined);

            setTimeout(() => {
                setIsDrag(false);
                if (overlayCanvasRef.current) {
                    overlayCanvasRef.current.style.pointerEvents = 'none';
                }
            }, 300);
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
                    drawnLabelsRef.current,
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
    }, [overlayCanvasRef.current, chart, selectedLine]);

    return null;
};

export default LabelComponent;
