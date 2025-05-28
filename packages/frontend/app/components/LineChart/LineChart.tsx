import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './LineChart.module.css';

type LineChartProps = {
    lineData: { time: number; value: number }[] | undefined;
};

const LineChart: React.FC<LineChartProps> = (props) => {
    const { lineData } = props;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [xScale, setXScale] = React.useState<d3.ScaleTime<number, number>>();
    const [yScale, setYScale] =
        React.useState<d3.ScaleLinear<number, number>>();

    const [ticks, setTicks] = React.useState<Array<number>>();

    const formatYAxisTicks = () => {
        if (yScale) {
            const diff = yScale.domain()[1] - yScale.domain()[0];

            const padding = diff / 5;

            const topBoundary = yScale.domain()[1] - padding / 2;
            const bottomBoundary = yScale.domain()[0] + padding / 2;

            const ticks: Array<number> = [];

            ticks.push(topBoundary);
            ticks.push(bottomBoundary);

            let current = topBoundary - padding;

            while (current >= bottomBoundary) {
                ticks.push(current);
                current -= padding;
            }

            return ticks;
        }

        return [];
    };

    useEffect(() => {
        if (lineData === undefined) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasHeight = canvas.getBoundingClientRect().height;
        const canvasWidth = canvas.getBoundingClientRect().width;

        const minDate = d3.min(lineData, (d) => d.time);
        const maxDate = d3.max(lineData, (d) => d.time);

        // Scales
        if (minDate && maxDate && lineData) {
            const xScale = d3
                .scaleTime()
                .domain([new Date(minDate), new Date(maxDate)])
                .range([0, canvasWidth]);

            setXScale(() => xScale);
        }

        const minPrice = d3.min(lineData, (d) => d.value);
        const maxPrice = d3.max(lineData, (d) => d.value);

        if (minPrice !== undefined && maxPrice !== undefined) {
            const diff = maxPrice - minPrice;

            const padding = diff / 15;

            const yScale = d3
                .scaleLinear()
                .domain([minPrice - padding, maxPrice + padding])
                .range([canvasHeight, 0]);

            setYScale(() => yScale);
        }
    }, [lineData]);

    useEffect(() => {
        const svgXAxis = d3.select('#xAxis');
        const svgYAxis = d3.select('#yAxis');

        const fillStyle = 'var(--text1)';
        const font = 'var(--font-family-main)';
        const fontSize = 'var(--font-size-s)';

        if (xScale) {
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

        if (yScale) {
            const ticks = formatYAxisTicks();

            setTicks(() => ticks);

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
    }, [yScale !== undefined, xScale !== undefined]);

    useEffect(() => {
        if (yScale && xScale && lineData) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            if (!context) return;

            const width = canvas.getBoundingClientRect().width;
            const height = canvas.getBoundingClientRect().height;

            context.clearRect(0, 0, width, height);

            const line = d3
                .line<{ time: number; value: number }>()
                .x((d) => xScale(new Date(d.time)))
                .y((d) => yScale(d.value))
                .curve(d3.curveMonotoneX)
                .context(context);

            context.beginPath();
            line(lineData);
            context.lineWidth = 2;
            context.strokeStyle = '#7371fc';
            context.stroke();
        }
    }, [yScale !== undefined, xScale !== undefined, lineData]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (yScale && xScale) {
            ctx.beginPath();

            ticks?.forEach((tick) => {
                ctx.moveTo(xScale(xScale.domain()[0]), yScale(tick));
                ctx.lineTo(xScale(xScale.domain()[1]), yScale(tick));
            });
            ctx.strokeStyle = 'rgba(189,189,189,0.15)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }, [yScale !== undefined, xScale !== undefined, ticks, lineData]);

    return (
        <div className={styles.chartWrapper}>
            <div className={styles.chartContainer}>
                <svg id='yAxis' height='250' />
                <canvas ref={canvasRef} width='850' height='250' />
            </div>
            <div className={styles.xAxisContainer}>
                <svg id='xAxis' height='50' width='900' />
            </div>
        </div>
    );
};

export default LineChart;
