import { useEffect, useMemo, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import {
    addCustomOrderLabel,
    addCustomOrderLine,
    createShapeText,
} from './customOrderLineUtils';

const CustomOrderLine = () => {
    const { chart } = useTradingView();

    const price = 100000;

    const [orderLine, setOrderLine] = useState<Promise<any> | undefined>();
    const [orderText, setOrderText] = useState<Promise<any> | undefined>();

    useEffect(() => {
        if (chart) {
            const line = addCustomOrderLine(chart, price);
            const orderText = createShapeText(chart, price);

            setOrderText(orderText);
            setOrderLine(line);
        }
    }, [chart]);

    const priceToPixel = (
        minPrice: number,
        maxPrice: number,
        chartHeight: number,
        isLogarithmic: boolean = false,
    ) => {
        const textHeight = 10;

        if (isLogarithmic) {
            const logMinPrice = Math.log(minPrice);
            const logMaxPrice = Math.log(maxPrice);
            const logPrice = Math.log(price);

            const priceDifference = logMaxPrice - logMinPrice;
            const relativePrice = logPrice - logMinPrice;
            const pixelCoordinate =
                (relativePrice / priceDifference) * chartHeight;

            return chartHeight - pixelCoordinate - textHeight / 2;
        } else {
            const priceDifference = maxPrice - minPrice;
            const relativePrice = price - minPrice;
            const pixelCoordinate =
                (relativePrice / priceDifference) * chartHeight;

            return chartHeight - pixelCoordinate - textHeight / 2;
        }
    };

    useEffect(() => {
        let interval: any = undefined;
        if (chart && orderText && orderLine) {
            orderText.then((res) => {
                interval = setInterval(() => {
                    const priceScalePane = chart
                        .activeChart()
                        .getPanes()[0] as any;
                    const priceScale = priceScalePane.getMainSourcePriceScale();

                    const activeLabel = chart.activeChart().getShapeById(res);
                    const priceRange = priceScale.getVisiblePriceRange();

                    if (!priceRange) return;

                    const maxPrice = priceRange.to;
                    const minPrice = priceRange.from;

                    const chartHeight = priceScalePane.getHeight();

                    const result = priceToPixel(
                        minPrice,
                        maxPrice,
                        chartHeight,
                        priceScale.getMode() === 1,
                    );
                    const pricePerPixel = (result * 1) / chartHeight;

                    /*      const time = chart
                        .activeChart()
                        .getTimeScale()
                        .coordinateToTime(chartWidth) as number; */

                    activeLabel.setAnchoredPosition({
                        x: 0.2,
                        y: pricePerPixel,
                    });
                    chart.activeChart().restoreChart();
                }, 10);
            });
        }

        return () => {
            clearInterval(interval);
        };
    }, [orderText]);

    return null;
};

export default CustomOrderLine;
