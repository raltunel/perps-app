import { useEffect } from 'react';
import type { LineData } from './LineComponent';
import { useTradingView } from '~/contexts/TradingviewContext';
import { drawLabel } from '../orderLineUtils';
import {
    formatLineLabel,
    getPricetoPixel,
    quantityTextFormatWithComma,
} from '../customOrderLineUtils';

interface LabelProps {
    lines: LineData[];
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

const LabelComponent = ({ lines, overlayCanvasRef }: LabelProps) => {
    const { chart, isChartReady } = useTradingView();

    const ctx = overlayCanvasRef.current?.getContext('2d');

    useEffect(() => {
        if (!chart || !isChartReady) return;
        if (!ctx) return;

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            lines.forEach((line) => {
                const yPricePixel = getPricetoPixel(chart, line.yPrice).pixel;
                const timeScale = chart.activeChart().getTimeScale();
                const chartWidth = Math.floor(timeScale.width());
                const xPixel = chartWidth * line.xLoc;

                const labelOptions = [
                    {
                        text: formatLineLabel(line.textValue),
                        backgroundColor: '#D1D1D1',
                        textColor: '#3C91FF',
                        borderColor: line.color,
                    },
                    ...(line.quantityTextValue
                        ? [
                              {
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
                                  text: 'X',
                                  backgroundColor: '#000000',
                                  textColor: '#FFFFFF',
                                  borderColor: '#3C91FF',
                              },
                          ]
                        : []),
                ];

                drawLabel(ctx, {
                    x: xPixel,
                    y: yPricePixel,
                    labelOptions: labelOptions,
                });
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        animationFrameId = requestAnimationFrame(draw);

        return () => cancelAnimationFrame(animationFrameId);
    }, [chart, isChartReady, lines, ctx]);

    return null;
};

export default LabelComponent;
