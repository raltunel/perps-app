import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as d3fc from 'd3fc';
import styles from './PerformanceLineChart.module.css';

const PerformanceLineChart: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const d3YaxisCanvas = useRef<HTMLCanvasElement | null>(null);
    const d3XaxisCanvas = useRef<HTMLCanvasElement | null>(null);

    const [xScale, setXScale] = React.useState<d3.ScaleTime<number, number>>();
    const [yScale, setYScale] =
        React.useState<d3.ScaleLinear<number, number>>();

    // Sample data
    const data = [
        { date: new Date(2023, 0, 1), value: 50 },
        { date: new Date(2023, 1, 1), value: 70 },
        { date: new Date(2023, 2, 1), value: 60 },
        { date: new Date(2023, 3, 1), value: 90 },
        { date: new Date(2023, 4, 1), value: 80 },
    ];

    useEffect(() => {
        const canvas = d3YaxisCanvas.current;
        if (!canvas) return;

        const canvasHeight = canvas.getBoundingClientRect().height;
        const canvasWidth = canvas.getBoundingClientRect().width;

        // Scales
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, (d) => d.date) as [Date, Date])
            .range([0, canvasWidth]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value) as number])
            .range([canvasHeight, 0]);

        setXScale(xScale);
        setYScale(yScale);
    }, [data]);

    useEffect(() => {
        if (yScale !== undefined) {
            const yAxis = d3fc
                .axisRight()
                .scale(yScale)
                .tickValues([0.0005, 0.004, 0.01]);

            const canvas = d3
                .select(d3YaxisCanvas.current)
                .select('canvas')
                .node() as any;

            const d3YaxisContext = canvas.getContext('2d');

            d3.select(d3YaxisCanvas.current).on('draw', function () {
                if (yAxis) {
                    d3YaxisContext.stroke();
                    d3YaxisContext.textAlign = 'left';
                    d3YaxisContext.textBaseline = 'middle';
                    d3YaxisContext.fillStyle = 'rgba(189,189,189,0.8)';
                    d3YaxisContext.font = '11.425px Lexend Deca';

                    yAxis.tickValues().forEach((d: number) => {
                        d3YaxisContext.beginPath();
                        d3YaxisContext.fillText(
                            d * 100 + '%',
                            canvas.width / 6,
                        );
                    });
                }
            });
        }
    }, [yScale]);

    useEffect(() => {
        if (yScale && xScale) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            if (!context) return;

            const width = canvas.getBoundingClientRect().width;
            const height = canvas.getBoundingClientRect().height;

            // Clear canvas
            context.clearRect(0, 0, width, height);

            // Draw line
            const line = d3
                .line<{ date: Date; value: number }>()
                .x((d) => xScale(d.date))
                .y((d) => yScale(d.value))
                .context(context);

            context.beginPath();
            line(data);
            context.lineWidth = 2;
            context.strokeStyle = '#007bff';
            context.stroke();
        }
    }, [xScale, yScale, data]);

    return (
        <div className={styles.chartWrapper}>
            <div className={styles.chartContainer}>
                <canvas ref={canvasRef} />
                <canvas ref={d3YaxisCanvas} />
            </div>
            <canvas ref={d3XaxisCanvas} />
        </div>
    );
};

export default PerformanceLineChart;
