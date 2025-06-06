import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import { useAppSettings } from '~/stores/AppSettingsStore';
import styles from './LineChart.module.css';

type CurveType = 'step' | 'basic';

type LineChartProps = {
    lineData: { time: number; value: number }[] | undefined;
    curve: CurveType;
    chartName: string;
};

const LineChart: React.FC<LineChartProps> = (props) => {
    const { lineData, chartName, curve } = props;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [xScale, setXScale] = React.useState<d3.ScaleTime<number, number>>();
    const [yScale, setYScale] =
        React.useState<d3.ScaleLinear<number, number>>();

    const [ticks, setTicks] = React.useState<Array<number>>();
    const [yAxisPadding, setYAxisPadding] = React.useState<number>(50);

    const { numFormat } = useAppSettings();

    const formatYAxisTicks = () => {
        if (yScale) {
            const maxPrice = yScale.domain()[1];
            const minPrice = yScale.domain()[0];

            const diff = maxPrice - minPrice;

            const padding = diff / 5;

            const factor = Math.pow(10, Math.floor(Math.log10(maxPrice)));

            const topBoundary =
                Math.ceil((yScale.domain()[1] - padding / 2) / factor) * factor;
            const bottomBoundary =
                Math.floor((yScale.domain()[0] + padding / 2) / factor) *
                factor;

            const isOriginNearTop =
                Math.abs(topBoundary - padding / 4) < padding / 4 ||
                Math.abs(topBoundary + padding / 4) < padding / 4;
            const isOriginNearBottom =
                Math.abs(bottomBoundary - padding / 4) < padding / 4 ||
                Math.abs(bottomBoundary + padding / 4) < padding / 4;

            const tickDiff = (topBoundary - bottomBoundary) / 4;

            const ticks: Array<number> = [];

            const topTick = isOriginNearTop ? 0 : topBoundary;
            const bottomTick = isOriginNearBottom ? 0 : bottomBoundary;

            ticks.push(topTick);
            ticks.push(bottomTick);

            let current = topTick - tickDiff;

            while (current > bottomTick) {
                ticks.push(current);
                current -= tickDiff;
            }

            console.log(d3.ticks(yScale.domain()[0], yScale.domain()[1], 5));

            return ticks;
        }

        return [];
    };

    useEffect(() => {
        if (lineData === undefined) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasHeight = canvas.getBoundingClientRect()?.height;
        const canvasWidth = canvas.getBoundingClientRect().width;

        const minDate = d3.min(lineData, (d) => d.time);
        const maxDate = d3.max(lineData, (d) => d.time);

        // Scales
        if (minDate && maxDate && lineData) {
            const diff = maxDate - minDate;

            const padding = diff / 40;

            const xScale = d3
                .scaleTime()
                .domain([
                    new Date(minDate - padding),
                    new Date(maxDate + padding),
                ])
                .range([0, canvasWidth]);

            setXScale(() => xScale);
        }

        const minPrice = d3.min(lineData, (d) => d.value);
        const maxPrice = d3.max(lineData, (d) => d.value);

        if (minPrice !== undefined && maxPrice !== undefined) {
            const diff = maxPrice - minPrice;

            const padding = diff / 15;

            const ticks = d3.ticks(minPrice - padding, maxPrice + padding, 5);

            setTicks(() => ticks);

            const roundedMax = d3.max(
                d3.ticks(minPrice - padding, maxPrice + padding, 5),
            );
            const roundedMin = d3.min(
                d3.ticks(minPrice - padding, maxPrice + padding, 5),
            );

            if (roundedMax !== undefined && roundedMin !== undefined) {
                const topBoundaryCanFit =
                    maxPrice +
                    padding *
                        (maxPrice + padding - roundedMax < padding ? 2 : 1);

                const bottomBoundaryCanFit =
                    minPrice -
                    padding *
                        (minPrice - padding - roundedMin < padding ? 2 : 1);

                const yScale = d3
                    .scaleLinear()
                    .domain([bottomBoundaryCanFit, topBoundaryCanFit])
                    .range([canvasHeight, 0]);

                setYScale(() => yScale);
            }
        }
    }, [lineData, chartName]);

    useEffect(() => {
        const svgXAxis = d3.select('#xAxis');
        const svgYAxis = d3.select('#yAxis');

        const fillStyle = 'var(--text1)';
        const font = 'var(--font-family-main)';
        const fontSize = 'var(--font-size-s)';

        if (xScale) {
            svgXAxis.select('g').remove();

            svgXAxis
                .append('g')
                .call(d3.axisBottom(xScale).ticks(7))
                .select('.domain')
                .remove();

            svgXAxis.selectAll('line').remove();

            svgXAxis
                .select('g')
                .selectAll('text')
                .attr('fill', fillStyle)
                .attr('shape-rendering', 'crispEdges')
                .style('font-family', font)
                .style('font-size', fontSize);
        }

        if (yScale && ticks) {
            svgYAxis.select('g').remove();

            svgYAxis
                .append('g')
                .call(d3.axisRight(yScale).tickValues(ticks))
                .select('.domain')
                .remove();

            svgYAxis.selectAll('line').remove();

            svgYAxis
                .select('g')
                .selectAll('text')
                .attr('fill', fillStyle)
                .attr('shape-rendering', 'crispEdges')
                .style('font-family', font)
                .style('font-size', fontSize);
        }
    }, [yScale, xScale, numFormat, lineData, chartName, ticks]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        if (ticks) {
            let textMeasure = 30;

            ticks?.forEach((tick) => {
                textMeasure = Math.max(
                    textMeasure,
                    context.measureText(tick.toString()).width,
                );
            });

            setYAxisPadding(() => textMeasure + 30);
        }
    }, [ticks, chartName, lineData]);

    useEffect(() => {
        if (yScale && xScale && lineData) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            if (!context) return;

            const width = canvas.getBoundingClientRect().width;
            const height = canvas.getBoundingClientRect()?.height;

            context.clearRect(0, 0, width, height);

            const line = d3
                .line<{ time: number; value: number }>()
                .x((d) => xScale(new Date(d.time)))
                .y((d) => yScale(d.value))
                .curve(curve === 'step' ? d3.curveStep : d3.curveBasis)
                .context(context);

            context.beginPath();
            line(lineData);
            context.lineWidth = 2;
            context.strokeStyle = '#7371fc';
            context.stroke();

            ticks?.forEach((tick) => {
                context.moveTo(xScale(xScale.domain()[0]), yScale(tick));
                context.lineTo(xScale(xScale.domain()[1]), yScale(tick));
            });
            context.strokeStyle = 'rgba(189,189,189,0.15)';
            context.lineWidth = 2;
            context.stroke();
        }
    }, [
        yScale !== undefined,
        xScale !== undefined,
        lineData,
        chartName,
        ticks,
    ]);

    return (
        <div className={styles.chartWrapper}>
            <div
                className={styles.chartContainer}
                style={{ gridTemplateColumns: yAxisPadding + 'px 850px' }}
            >
                <svg id='yAxis' height='250' />
                <canvas ref={canvasRef} width='850' height='250' />
            </div>
            <div className={styles.xAxisContainer}>
                <svg
                    id='xAxis'
                    height='50'
                    width={850 + yAxisPadding}
                    style={{ paddingLeft: yAxisPadding }}
                />
            </div>
        </div>
    );
};

export default LineChart;
