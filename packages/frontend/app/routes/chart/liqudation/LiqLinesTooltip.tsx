import { useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { LiqProps } from './LiqComponent';
import { useTradingView } from '~/contexts/TradingviewContext';

const LiqLineTooltip = ({
    overlayCanvasRef,
    canvasWrapperRef,
    canvasSize,
    scaleData,
    zoomChanged,
}: LiqProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const liqLineTooltipRef = useRef<any>(null);

    const { chart } = useTradingView();

    const mousemove = useCallback((offsetX: number, offsetY: number) => {
        // Fill and place tooltip
        if (!liqLineTooltipRef.current) return;

        liqLineTooltipRef.current.html(
            '<p>' +
                23 + // formatNum(percentage) +
                '%</p>' +
                '<p>' +
                55 + // formatNum(price, 2) +
                ' </p>',
        );

        // const width = liqLineTooltipRef.current
        //     .node()
        //     .getBoundingClientRect().width;

        // const height = liqLineTooltipRef.current
        //     .node()
        //     .getBoundingClientRect().height;

        // const horizontal = offsetX - width / 2;
        // const vertical = offsetY - (height + 10);

        liqLineTooltipRef.current
            .style('visibility', 'visible')
            .style('top', offsetY + 'px')
            .style('left', offsetX + 'px');

        // highlightHoveredArea.current = true;
    }, []);

    useEffect(() => {
        if (!overlayCanvasRef.current || !canvasWrapperRef.current) return;

        if (chart) {
            chart.onChartReady(() => {
                chart
                    .activeChart()
                    .crossHairMoved()
                    .subscribe(null, ({ offsetX, offsetY }) => {
                        if (offsetX && offsetY) {
                            mousemove(offsetX, offsetY);
                        }
                    });
            });
        }

        if (
            d3
                .select(canvasWrapperRef.current)
                .select('.liqLineTooltip')
                .node() === null
        ) {
            const liqLineTooltip = d3
                .select(canvasWrapperRef.current)
                .append('div')
                .attr('class', 'liqLineTooltip')
                .style('position', 'absolute')
                .style('text-align', 'center')
                .style('align-items', 'center')
                .style('background', 'red')
                .style('padding', '3px')
                .style('font-size', 'small')
                .style('pointer-events', 'none')
                .style('width', '50px')
                .style('height', '50px')
                .style('background', 'white')
                .style('visibility', 'hidden');

            liqLineTooltipRef.current = liqLineTooltip;
        }
    }, [overlayCanvasRef.current === null, canvasWrapperRef.current === null]);

    return null;
};

export default LiqLineTooltip;
