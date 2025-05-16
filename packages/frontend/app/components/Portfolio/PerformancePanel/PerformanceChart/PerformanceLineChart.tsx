import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './PerformanceLineChart.module.css';

const PerformanceLineChart: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [xScale, setXScale] = React.useState<d3.ScaleTime<number, number>>();
    const [yScale, setYScale] =
        React.useState<d3.ScaleLinear<number, number>>();

    const [ticks, setTicks] = React.useState<Array<number>>();

    // Sample data
    const data = [
        { time: 1675209600, value: 702 },
        { time: 1676419200, value: 103 },
        { time: 1677628800, value: 601 },
        { time: 1678838400, value: 484 },
        { time: 1680048000, value: 794 },
        { time: 1681257600, value: 275 },
        { time: 1682467200, value: 586 },
        { time: 1683676800, value: 356 },
        { time: 1684886400, value: 268 },
        { time: 1686096000, value: 785 },
        { time: 1687305600, value: 118 },
        { time: 1688515200, value: 692 },
        { time: 1689724800, value: 274 },
        { time: 1690934400, value: 167 },
        { time: 1692144000, value: 589 },
        { time: 1693353600, value: 555 },
        { time: 1694563200, value: 448 },
        { time: 1695772800, value: 551 },
        { time: 1696982400, value: 893 },
        { time: 1698192000, value: 118 },
        { time: 1699401600, value: 812 },
        { time: 1700611200, value: 641 },
        { time: 1701820800, value: 271 },
        { time: 1703030400, value: 616 },
    ];

    const formatYAxisTicks = () => {
        if (yScale) {
            const diff = yScale.domain()[1] - yScale.domain()[0];

            const padding = diff / 20;

            const factor = Math.pow(10, Math.floor(Math.log10(diff)));

            const min =
                Math.ceil((yScale.domain()[0] + padding) / factor) * factor;
            const max =
                Math.floor((yScale.domain()[1] - padding) / factor) * factor;

            const diffFactor = Math.abs(max - min) / 4;

            const ticks: Array<number> = [];

            ticks.push(min);
            ticks.push(max);

            let current = max - diffFactor;

            while (current - padding >= min) {
                ticks.push(Math.ceil(current / factor) * factor);
                current -= diffFactor;
            }

            return ticks;
        }

        return [];
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasHeight = canvas.getBoundingClientRect().height;
        const canvasWidth = canvas.getBoundingClientRect().width;

        const minDate = d3.min(data, (d) => d.time);
        const maxDate = d3.max(data, (d) => d.time);

        // Scales
        if (minDate && maxDate) {
            const xScale = d3
                .scaleTime()
                .domain([new Date(minDate * 1000), new Date(maxDate * 1000)])
                .range([0, canvasWidth]);

            setXScale(() => xScale);
        }

        const minPrice = d3.min(data, (d) => d.value);
        const maxPrice = d3.max(data, (d) => d.value);

        if (minPrice && maxPrice) {
            const diff = maxPrice - minPrice;

            const padding = diff / 15;

            const yScale = d3
                .scaleLinear()
                .domain([minPrice - padding, maxPrice + padding])
                .range([canvasHeight, 0]);

            setYScale(() => yScale);
        }
    }, []);

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
        if (yScale && xScale) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            if (!context) return;

            const width = canvas.getBoundingClientRect().width;
            const height = canvas.getBoundingClientRect().height;

            context.clearRect(0, 0, width, height);

            const line = d3
                .line<{ time: number; value: number }>()
                .x((d) => xScale(new Date(d.time * 1000)))
                .y((d) => yScale(d.value))
                .curve(d3.curveNatural)
                .context(context);

            context.beginPath();
            line(data);
            context.lineWidth = 2;
            context.strokeStyle = '#7371fc';
            context.stroke();
        }
    }, [yScale !== undefined, xScale !== undefined, data]);

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
    }, [yScale !== undefined, xScale !== undefined, ticks]);

    return (
        <div className={styles.chartWrapper}>
            <div className={styles.chartContainer}>
                <svg id='yAxis' height='300' />
                <canvas ref={canvasRef} width='800' height='300' />
            </div>
            <div className={styles.xAxisContainer}>
                <svg id='xAxis' height='50' width='850' />
            </div>
        </div>
    );
};

export default PerformanceLineChart;
