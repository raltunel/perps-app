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
    const [linePrice, setLinePrice] = useState({ price: price });

    const [orderLine, setOrderLine] = useState<Promise<any> | undefined>();
    const [orderLabel, setOrderLabel] = useState<Promise<any> | undefined>();
    const [orderText, setOrderText] = useState<Promise<any> | undefined>();
    const [isDrag, setIsDrag] = useState(false);

    const [updatedStartTime, setUpdatedStartTime] = useState<any>();

    useEffect(() => {
        if (chart) {
            const line = addCustomOrderLine(chart, price);
            const label = addCustomOrderLabel(chart, price);
            const orderText = createShapeText(chart, price);

            setOrderLine(line);
            setOrderLabel(label);
            setOrderText(orderText);
        }
    }, [chart]);

    useEffect(() => {
        if (orderLine && chart) {
            (orderLine as any)?.then((i: any) => {
                const activeLine = chart.activeChart().getShapeById(i);
                const points = activeLine.getPoints();
                if (activeLine && points) {
                    const newPrice = points[0].price;
                    linePrice.price = newPrice;
                    setLinePrice({ price: newPrice });
                }
            });

            chart.subscribe('drawing_event', (id: any, type: any) => {
                (orderLine as any)?.then((i: any) => {
                    if (id === i) {
                        setIsDrag(true);
                        const activeLine = chart.activeChart().getShapeById(id);
                        const points = activeLine.getPoints();
                        if (activeLine && points) {
                            const newPrice = points[0].price;
                            linePrice.price = newPrice;

                            setLinePrice({ price: newPrice });
                        }
                    }
                });
            });
        }
    }, [orderLine]);

    useEffect(() => {
        if (chart /* && isDrag */) {
            // chart
            //     .activeChart()
            //     .crossHairMoved()
            //     .subscribe(null, ({ price }) => {
            //         console.log({ price });

            orderLabel?.then((res: any) => {
                chart
                    .chart()
                    .onIntervalChanged()
                    .subscribe(null, () => {
                        res.applyOverrides({
                            lock: true, // Dikdörtgeni kilitle
                        });
                    });

                const activeLabel = chart.activeChart().getShapeById(res);

                const activeLabelPoints = activeLabel.getPoints();

                const newPrice = linePrice.price;
                const buffer = 2000;
                const rectTopLeft = {
                    time: activeLabelPoints[0].time,
                    price: newPrice + buffer,
                };
                const rectBottomRight = {
                    time: activeLabelPoints[1].time,
                    price: newPrice - buffer,
                };
                activeLabel.setPoints([rectTopLeft, rectBottomRight]);
            });
            // });
        }
    }, [orderText]);

    useEffect(() => {
        if (chart && orderText) {
            orderText.then((res) => {
                chart
                    .activeChart()
                    .onVisibleRangeChanged()
                    .subscribe(null, ({ from, to }) => {
                        // setUpdatedStartTime({ from: from, to: to });

                        const RECT_WIDTH_PX = 80;

                        const activeLabel = chart
                            .activeChart()
                            .getShapeById(res);
                        const timeScale = chart.activeChart().getTimeScale();

                        const startTime = from;
                        const endTime = to;
                        const chartWidth = Math.floor(timeScale.width());

                        const timePerPixel = Math.floor(
                            (endTime - startTime) / chartWidth,
                        );

                        const rectWidthTime = timePerPixel * RECT_WIDTH_PX;

                        const rectTopLeft = {
                            time: startTime + rectWidthTime,
                            price: price,
                        };

                        activeLabel.setPoints([rectTopLeft]);
                    });
            });
        }
    }, [linePrice]);

    // useEffect(() => {
    //     if (chart && orderText) {
    //         orderText.then((res) => {
    //             const RECT_WIDTH_PX = 80;

    //             const activeLabel = chart.activeChart().getShapeById(res);
    //             const timeScale = chart.activeChart().getTimeScale();

    //             const startTime = updatedStartTime.from;
    //             const endTime = updatedStartTime.to;
    //             const chartWidth = Math.floor(timeScale.width());

    //             const timePerPixel = Math.floor(
    //                 (endTime - startTime) / chartWidth,
    //             );

    //             const rectWidthTime = timePerPixel * RECT_WIDTH_PX;

    //             const rectTopLeft = {
    //                 time: startTime + rectWidthTime,
    //                 price: price,
    //             };

    //             activeLabel.setPoints([rectTopLeft]);
    //         });
    //     }
    // }, [updatedStartTime]);

    return null;
};

export default CustomOrderLine;
