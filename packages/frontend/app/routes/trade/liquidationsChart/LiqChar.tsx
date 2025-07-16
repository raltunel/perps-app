import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as d3fc from 'd3fc';
import type { OrderBookRowIF } from '~/utils/orderbook/OrderBookIFs';

interface LiquidationsChartProps {
    buyData: OrderBookRowIF[];
    sellData: OrderBookRowIF[];
    width?: number;
    height?: number;
}

const LiquidationsChart: React.FC<LiquidationsChartProps> = (props) => {
    const { sellData, buyData, width = 300, height = 400 } = props;

    const d3CanvasLiq = useRef<HTMLCanvasElement | null>(null);

    // Scale with RATIO
    const [xScale, setXScale] =
        React.useState<d3.ScaleLinear<number, number>>();

    // Scale with PX
    const [buyYScale, setBuyYScale] =
        React.useState<d3.ScaleLinear<number, number>>();
    const [sellYScale, setSellYScale] =
        React.useState<d3.ScaleLinear<number, number>>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [sellAreaSeries, setSellAreaSeries] = React.useState<any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [buyAreaSeries, setBuyAreaSeries] = React.useState<any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [sellLineSeries, setSellLineSeries] = React.useState<any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [buyLineSeries, setBuyLineSeries] = React.useState<any>();

    const chartHeight = height;
    const chartWidth = width;

    const currentFrame = useRef(0);

    const animFrameRef = useRef<number | null>(null);
    const animDuration = 50;

    const isAnimating = useRef(false);

    const [currentBuyData, setCurrentBuyData] =
        useState<OrderBookRowIF[]>(buyData);
    const [currentSellData, setCurrentSellData] =
        useState<OrderBookRowIF[]>(sellData);

    useEffect(() => {
        if (currentBuyData === undefined || currentSellData === undefined)
            return;
        if (currentBuyData.length === 0 || currentSellData.length === 0) return;

        // Scale with RATIO
        const xScale = d3.scaleLinear().domain([0, 1]).range([chartWidth, 0]);

        const topBoundaryBuy = Math.max(...currentBuyData.map((d) => d.px));
        const bottomBoundaryBuy = Math.min(...currentBuyData.map((d) => d.px));

        const topBoundarySell = Math.max(...currentSellData.map((d) => d.px));
        const bottomBoundarySell = Math.min(
            ...currentSellData.map((d) => d.px),
        );

        // Scale with PX
        const buyYScale = d3
            .scaleLinear()
            .domain([bottomBoundaryBuy, topBoundaryBuy])
            .range([chartHeight, chartHeight / 2]);

        const sellYScale = d3
            .scaleLinear()
            .domain([bottomBoundarySell, topBoundarySell])
            .range([chartHeight / 2, 0]);

        setXScale(() => xScale);

        setBuyYScale(() => buyYScale);
        setSellYScale(() => sellYScale);
    }, [
        JSON.stringify(currentBuyData),
        JSON.stringify(currentSellData),
        width,
        height,
    ]);

    const interPolateData = useCallback(
        (
            fromData: OrderBookRowIF[],
            toData: OrderBookRowIF[],
            progress: number,
        ) => {
            if (progress < 0) return fromData;
            if (progress > 1) return toData;

            const interpolatedData: OrderBookRowIF[] = [];

            for (let i = 0; i < fromData.length; i++) {
                const fromRow = fromData[i];
                const toRow = toData[i];

                const interpolatedRow = {
                    ...fromRow,
                    ratio:
                        (fromRow.ratio || 0) +
                        ((toRow.ratio || 0) - (fromRow.ratio || 0)) * progress,
                    px:
                        (fromRow.px || 0) +
                        ((toRow.px || 0) - (fromRow.px || 0)) * progress,
                    sz:
                        (fromRow.sz || 0) +
                        ((toRow.sz || 0) - (fromRow.sz || 0)) * progress,
                };

                interpolatedData.push(interpolatedRow);
            }

            return interpolatedData;
        },
        [],
    );

    const animateChart = useCallback(
        (newBuyData: OrderBookRowIF[], newSellData: OrderBookRowIF[]) => {
            if (isAnimating.current && animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                isAnimating.current = false;
            }

            isAnimating.current = true;

            const startTs = performance.now();

            const anim = (time: number) => {
                const elapsed = time - startTs;
                const progress = Math.min(elapsed / animDuration, 1);

                const interpolatedBuys = interPolateData(
                    currentBuyData,
                    newBuyData,
                    progress,
                );
                const interpolatedSells = interPolateData(
                    currentSellData,
                    newSellData,
                    progress,
                );

                setCurrentBuyData(interpolatedBuys);
                setCurrentSellData(interpolatedSells);

                animFrameRef.current = requestAnimationFrame(anim);

                if (progress < 1) {
                    requestAnimationFrame(anim);
                } else {
                    isAnimating.current = false;
                    animFrameRef.current = null;
                }
            };

            animFrameRef.current = requestAnimationFrame(anim);
        },
        [currentBuyData, currentSellData, animDuration, interPolateData],
    );

    useEffect(() => {
        if (sellYScale && buyYScale && xScale && sellData && buyData) {
            const canvas = d3
                .select(d3CanvasLiq.current)
                .select('canvas')
                .node() as HTMLCanvasElement;

            const context = canvas.getContext('2d');
            if (!context) return;

            const curve = d3.curveStepAfter;

            const style = getComputedStyle(context.canvas);

            const buyRgbaColor = style.getPropertyValue('--green');
            const sellRgbaColor = style.getPropertyValue('--red');

            const d3buyRgbaColor = d3.color(buyRgbaColor)?.copy();
            const d3sellRgbaColor = d3.color(sellRgbaColor)?.copy();

            if (d3buyRgbaColor) d3buyRgbaColor.opacity = 0.4;
            if (d3sellRgbaColor) d3sellRgbaColor.opacity = 0.4;

            const sellArea = d3fc
                .seriesCanvasArea()
                .orient('horizontal')
                .curve(curve)
                .decorate((context: CanvasRenderingContext2D) => {
                    context.fillStyle = d3sellRgbaColor
                        ? d3sellRgbaColor?.toString()
                        : '#ff5c5c';
                })
                .mainValue((d: OrderBookRowIF) => d.ratio)
                .crossValue((d: OrderBookRowIF) => d.px)
                .xScale(xScale)
                .yScale(sellYScale);

            const buyArea = d3fc
                .seriesCanvasArea()
                .orient('horizontal')
                .curve(curve)
                .decorate((context: CanvasRenderingContext2D) => {
                    context.fillStyle = d3buyRgbaColor
                        ? d3buyRgbaColor?.toString()
                        : '4cd471';
                })
                .mainValue((d: OrderBookRowIF) => d.ratio)
                .crossValue((d: OrderBookRowIF) => d.px)
                .xScale(xScale)
                .yScale(buyYScale);

            const sellLine = d3fc
                .seriesCanvasLine()
                .orient('horizontal')
                .curve(curve)
                .mainValue((d: OrderBookRowIF) => d.ratio)
                .crossValue((d: OrderBookRowIF) => d.px)
                .xScale(xScale)
                .yScale(sellYScale)
                .decorate((context: CanvasRenderingContext2D) => {
                    context.strokeStyle = sellRgbaColor;
                    context.lineWidth = 1.5;
                });

            const buyLine = d3fc
                .seriesCanvasLine()
                .orient('horizontal')
                .curve(curve)
                .mainValue((d: OrderBookRowIF) => d.ratio)
                .crossValue((d: OrderBookRowIF) => d.px)
                .xScale(xScale)
                .yScale(buyYScale)
                .decorate((context: CanvasRenderingContext2D) => {
                    context.strokeStyle = buyRgbaColor;
                    context.lineWidth = 1.5;
                });

            setSellLineSeries(() => sellLine);
            setBuyLineSeries(() => buyLine);
            setSellAreaSeries(() => sellArea);
            setBuyAreaSeries(() => buyArea);
        }
    }, [buyYScale, sellYScale, xScale, width, height]);

    useEffect(() => {
        if (sellData.length === 0 || buyData.length === 0) return;
        if (sellAreaSeries && buyAreaSeries) {
            currentFrame.current = performance.now();

            const canvas = d3
                .select(d3CanvasLiq.current)
                .select('canvas')
                .node() as HTMLCanvasElement;

            const context = canvas.getContext('2d');
            if (!context) return;

            const container = d3.select(d3CanvasLiq.current).node() as any;
            if (container) container.requestRedraw();

            d3.select(d3CanvasLiq.current)
                .on('draw', () => {
                    sellAreaSeries(currentSellData);
                    buyAreaSeries(currentBuyData);
                    sellLineSeries(currentSellData);
                    buyLineSeries(currentBuyData);
                })
                .on('measure', (event: CustomEvent) => {
                    sellAreaSeries?.context(context);
                    sellLineSeries?.context(context);
                    buyAreaSeries?.context(context);
                    buyLineSeries?.context(context);
                });
        }
    }, [
        sellAreaSeries,
        buyAreaSeries,
        sellLineSeries,
        buyLineSeries,
        JSON.stringify(currentBuyData),
        JSON.stringify(currentSellData),
    ]);

    useEffect(() => {
        if (buyData.length === 0 || sellData.length === 0) return;
        animateChart(buyData, sellData);
    }, [JSON.stringify(buyData), JSON.stringify(sellData), animateChart]);

    return (
        <>
            <d3fc-canvas
                ref={d3CanvasLiq}
                style={{
                    position: 'relative',
                    width: `${chartWidth}px`,
                    height: `${chartHeight}px`,
                }}
            />
        </>
    );
};

export default LiquidationsChart;
