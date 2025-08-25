import { useEffect, useState } from 'react';
import type { LiqProps } from './LiqComponent';
import * as d3fc from 'd3fc';
import * as d3 from 'd3';

export type HorizontalLineData = {
    yPrice: number;
    color: string;
    oid?: number;
    lineStyle: number;
    lineWidth: number;
    type: string;
};

const LiqudationLines = ({
    overlayCanvasRef,
    canvasSize,
    scaleData,
}: LiqProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [horizontalLine, setHorizontalLine] = useState<any>();

    const levels = [
        {
            value: 104000,
            strokeStyle: '#FDE725',
            lineWidth: 9,
            globalAlpha: 0.7,
        },
        { value: 104000, strokeStyle: '#461668', lineWidth: 3, dash: [1, 2] },
        { value: 108000, strokeStyle: '#287D8D', lineWidth: 3, dash: [1, 2] },
        {
            value: 100000,
            strokeStyle: '#2BAE7D',
            lineWidth: 3,
            dash: [1, 2],
        },

        {
            value: 102000,
            strokeStyle: '#462C79',
            lineWidth: 3,
            dash: [1, 2],
        },
    ];

    useEffect(() => {
        if (scaleData !== undefined && canvasSize) {
            const dummyXScale = d3
                .scaleLinear()
                .domain([0, 1])
                .range([0, canvasSize.width]);

            const horizontalLine = d3fc
                .annotationCanvasLine()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .value((d: any) => d.value)
                .yScale(scaleData?.yScale)
                .xScale(dummyXScale)
                .orient('horizontal');

            horizontalLine.decorate(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (context: CanvasRenderingContext2D, d: any) => {
                    context.strokeStyle = d.strokeStyle;
                    context.fillStyle = d.strokeStyle;
                    context.lineWidth = d.lineWidth;
                    if (d.dash) context.setLineDash(d.dash);
                    if (d.globalAlpha) context.globalAlpha = d.globalAlpha;
                },
            );

            // const horizontalBand = d3fc
            //     .annotationCanvasBand()
            //     .orient('horizontal')
            //     .yScale(scaleData?.yScale)
            //     .fromValue((d: any) => d[0])
            //     .toValue((d: any) => d[1])
            //     .decorate((context: any) => {
            //         context.fillStyle = 'yellow';
            //     });

            setHorizontalLine(() => {
                return horizontalLine;
            });

            // setHorizontalBand(() => {
            //     return horizontalBand;
            // });
        }
    }, [scaleData, canvasSize]);

    useEffect(() => {
        if (overlayCanvasRef.current && horizontalLine) {
            const canvas = overlayCanvasRef.current;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

            horizontalLine.context(ctx);

            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                horizontalLine(levels);
            };

            render();
        }
    }, [horizontalLine, overlayCanvasRef.current === null, levels]);

    return null;
};

export default LiqudationLines;
