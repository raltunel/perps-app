import React, { useEffect, useRef, useState } from 'react';
// import { useOpenOrderLines } from './useOpenOrderLines';
// import { usePositionOrderLines } from './usePositionOrderLines';
import LineComponent, { type LineData } from './component/LineComponent';
import LabelComponent from './component/LabelComponent';
import { useTradingView } from '~/contexts/TradingviewContext';
import type { IPaneApi } from '~/tv/charting_library';
import type { LabelLocationData } from '../overlayCanvas/overlayCanvasUtils';
import { getPricetoPixel } from './customOrderLineUtils';
import { MIN_VISIBLE_ORDER_LABEL_RATIO } from '~/utils/Constants';
import { useOpenOrderLines } from './useOpenOrderLines';

export type OrderLinesProps = {
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasSize: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scaleData: any;
    overlayCanvasMousePositionRef: React.MutableRefObject<{
        x: number;
        y: number;
    }>;
};

export default function OrderLines({
    overlayCanvasRef,
    canvasSize,
    scaleData,
    overlayCanvasMousePositionRef,
}: OrderLinesProps) {
    const { chart } = useTradingView();

    const openLines = useOpenOrderLines();
    // const positionLines = usePositionOrderLines();

    const [lines, setLines] = useState<LineData[]>([]);
    const [visibleLines, setVisibleLines] = useState<LineData[]>([]);

    const [zoomChanged, setZoomChanged] = useState(false);
    const prevRangeRef = useRef<{ min: number; max: number } | null>(null);

    const animationFrameRef = useRef<number>(0);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isZoomingRef = useRef(false);
    const [localChartReady, setLocalChartReady] = useState(true);
    const drawnLabelsRef = useRef<LineData[]>([]);
    const [selectedLine, setSelectedLine] = useState<
        undefined | LabelLocationData
    >(undefined);

    useEffect(() => {
        console.log({ openLines });

        if (!chart || !scaleData) return;

        setLines([
            {
                xLoc: 0.4,
                yPrice: Math.ceil(scaleData.yScale.invert(100)),
                textValue: {
                    type: 'Limit',
                    price: Math.ceil(scaleData.yScale.invert(100)),
                    triggerCondition: '',
                },
                quantityTextValue: 0.00021,
                color: '#26A69A',
                type: 'LIMIT',
                oid: 119130072218,
                lineStyle: 3,
                lineWidth: 1,
            },
            {
                xLoc: 0.2,
                yPrice: scaleData.yScale.invert(120),
                textValue: {
                    type: 'Liq',
                    text: ' Liq. Price',
                },
                color: '#EF5350',
                type: 'LIQ',
                lineStyle: 0,
                lineWidth: 2,
                styleType: 3,
            },

            {
                xLoc: 0.2,
                yPrice: scaleData.yScale.invert(145),
                textValue: {
                    type: 'Liq',
                    text: ' Liq. Price',
                },
                color: '#EF5350',
                type: 'LIQ',
                lineStyle: 5,
                lineWidth: 2,
                styleType: 4,
            },

            {
                xLoc: 0.2,
                yPrice: scaleData.yScale.invert(170),
                textValue: {
                    type: 'Liq',
                    text: ' Liq. Price',
                },
                color: '#EF5350',
                type: 'LIQ',
                lineStyle: 5,
                lineWidth: 2,
                styleType: 5,
            },
            // {
            //     xLoc: 0.2,
            //     yPrice: scaleData.yScale.invert(200),
            //     textValue: {
            //         type: 'Liq',
            //         text: ' Liq. Price',
            //     },
            //     color: '#EF5350',
            //     type: 'LIQ',
            //     lineStyle: 5,
            //     lineWidth: 3,
            //     styleType: 2,
            // },

            // {
            //     xLoc: 0.2,
            //     yPrice: scaleData.yScale.invert(250),
            //     textValue: {
            //         type: 'Liq',
            //         text: ' Liq. Price',
            //     },
            //     color: '#EF5350',
            //     type: 'LIQ',
            //     lineStyle: 5,
            //     lineWidth: 3,
            //     styleType: 1,
            // },
            {
                xLoc: 0.2,
                yPrice: scaleData.yScale.invert(60),
                textValue: {
                    type: 'Liq',
                    text: ' Liq. Price',
                },
                color: '#EF5350',
                type: 'LIQ',
                lineStyle: 5,
                lineWidth: 2,
                styleType: 0,
            },
        ]);

        /*   const updatedLines = openLines.map((line) =>
            selectedLine && line.oid === selectedLine.parentLine.oid
                ? selectedLine.parentLine
                : line,
        );
        setLines([...updatedLines, ...positionLines]); */
    }, [
        /* openLines, positionLines, */ selectedLine,
        openLines,
        chart,
        JSON.stringify(scaleData?.yScale.domain()),
    ]);

    useEffect(() => {
        if (!chart || !scaleData) return;

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

                scaleData?.yScale.domain([currentRange.min, currentRange.max]);
                scaleData?.scaleSymlog.domain([
                    currentRange.min,
                    currentRange.max,
                ]);

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
    }, [chart, scaleData]);

    useEffect(() => {
        if (!scaleData || !lines.length || !chart || !canvasSize) return;

        const [minY, maxY] = scaleData.yScale.domain();

        const filtered = lines.filter((line) => {
            const height = canvasSize.height;

            const labelInformation = getPricetoPixel(
                chart,
                line.yPrice,
                height,
                scaleData,
            );
            const yPricePixel = labelInformation.pixel;

            const visibleBuffer =
                labelInformation.textHeight * MIN_VISIBLE_ORDER_LABEL_RATIO;
            const labelMaxPixel = Math.ceil(
                yPricePixel + labelInformation.textHeight,
            );

            const isVisibleEnough =
                Math.min(labelMaxPixel, height) - Math.max(yPricePixel, 0) >=
                visibleBuffer;

            const max = Math.max(minY, maxY);
            const min = Math.min(minY, maxY);
            return (
                (line.yPrice >= min && line.yPrice <= max && isVisibleEnough) ||
                (selectedLine && line.oid === selectedLine?.parentLine.oid)
            );
        });

        setVisibleLines(filtered);
    }, [
        lines,
        canvasSize,
        selectedLine,
        JSON.stringify(scaleData?.yScale.domain()),
    ]);

    return (
        <>
            <LineComponent
                key='lines'
                lines={visibleLines}
                localChartReady={localChartReady}
                setLocalChartReady={setLocalChartReady}
            />
            {localChartReady && (
                <LabelComponent
                    key='labels'
                    lines={visibleLines}
                    overlayCanvasRef={overlayCanvasRef}
                    zoomChanged={zoomChanged}
                    canvasSize={canvasSize}
                    drawnLabelsRef={drawnLabelsRef}
                    scaleData={scaleData}
                    selectedLine={selectedLine}
                    setSelectedLine={setSelectedLine}
                    overlayCanvasMousePositionRef={
                        overlayCanvasMousePositionRef
                    }
                />
            )}
        </>
    );
}
