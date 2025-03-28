import { useEffect, useMemo, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import {
    addCustomOrderLabel,
    addCustomOrderLine,
    createShapeText,
} from './customOrderLineUtils';
import { addPriceLabelIndicator } from './priceLabelInd';

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
            // const label = addCustomOrderLabel(chart, price);
            // setOrderLabel(label);

            // addPriceLabelIndicator(chart,price);
            const orderText = createShapeText(chart, price);

            /*      chart?.activeChart().createShape(
                { time: Math.floor(Date.now() / 1000), price: 100150 }, 
                {
                  shape: "horizontal_line", // Yatay çizgi ekle
                  disableSelection: true,
                  disableSave: true,
                  disableUndo: true,
                  overrides: {
                    "linecolor": "#FF0000", // 🔴 Kırmızı çizgi
                    "linewidth": 2,
                  }
                }
              );
              
              // 50 seviyesine arka planlı bir label ekle
              chart?.activeChart().createShape(
                { time: Math.floor(Date.now() / 1000), price: 100150 }, 
                {
                  shape: "text", // 🔥 Text etiketi ekle
                  text: "Resistance 50",
            
                }
              ); */

            // setOrderLine(line);
            // setOrderLabel(label);
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

    // useEffect(() => {
    //     if (chart /* && isDrag */) {
    //         // chart
    //         //     .activeChart()
    //         //     .crossHairMoved()
    //         //     .subscribe(null, ({ price }) => {
    //         //         console.log({ price });

    //         orderLabel?.then((res: any) => {
    //             /*     chart
    //                 .chart()
    //                 .onIntervalChanged()
    //                 .subscribe(null, () => {
    //                     res.applyOverrides({
    //                         lock: true, // Dikdörtgeni kilitle
    //                     });
    //                 }); */

    //             chart
    //                 .activeChart()
    //                 .crossHairMoved()
    //                 .subscribe(null, ({ price }) => {
    //                     setIsDrag(true);
    //                 });

    //             console.log({ chart });

    //             chart
    //                 .activeChart()
    //                 .onVisibleRangeChanged()
    //                 .subscribe(null, ({ from, to }) => {
    //                     // setUpdatedStartTime({ from: from, to: to });

    //                     const time = chart
    //                         .activeChart()
    //                         .getTimeScale()
    //                         .coordinateToTime(300);

    //                     time &&
    //                         console.log('time', time, new Date(time * 1000));

    //                     if (time) {
    //                         const RECT_WIDTH_PX = 80;

    //                         const activeLabel = chart
    //                             .activeChart()
    //                             .getShapeById(res);
    //                         /*
    //                         const timeScale = chart
    //                             .activeChart()
    //                             .getTimeScale();

    //                         const startTime = from;
    //                         const endTime = to;
    //                         const chartWidth = Math.floor(timeScale.width());

    //                         const diff = (endTime - startTime) / 2;
    //                         const timePerPixel = Math.floor(
    //                             (endTime - startTime) / chartWidth,
    //                         ); */
    //                         const buffer = 2000;

    //                         // console.log('diff', diff, startTime);

    //                         // const rectWidthTime = timePerPixel * RECT_WIDTH_PX;
    //                         const newPrice = linePrice.price;
    //                         const rectTopLeft = {
    //                             time: time,
    //                             price: newPrice + buffer,
    //                         };

    //                         const rectBottomRight = {
    //                             time: time,
    //                             price: newPrice - buffer,
    //                         };

    //                         activeLabel.setPoints([
    //                             rectTopLeft,
    //                             rectBottomRight,
    //                         ]);
    //                     }
    //                 });

    //             // const activeLabel = chart.activeChart().getShapeById(res);

    //             // const activeLabelPoints = activeLabel.getPoints();

    //             // const newPrice = linePrice.price;
    //             // const buffer = 2000;
    //             // const rectTopLeft = {
    //             //     time: activeLabelPoints[0].time,
    //             //     price: newPrice + buffer,
    //             // };
    //             // const rectBottomRight = {
    //             //     time: activeLabelPoints[1].time,
    //             //     price: newPrice - buffer,
    //             // };
    //             // activeLabel.setPoints([rectTopLeft, rectBottomRight]);
    //         });
    //         // });
    //     }
    // }, [orderLabel]);

    // useEffect(() => {
    //     if (isDrag && chart) {
    //         setInterval(() => {
    //             const time = chart
    //                 .activeChart()
    //                 .getTimeScale()
    //                 .coordinateToTime(300);

    //             if (time) {
    //                 orderLabel?.then((res: any) => {
    //                     const buffer = 2000;
    //                     const activeLabel = chart
    //                         .activeChart()
    //                         .getShapeById(res);
    //                     // console.log('diff', diff, startTime);

    //                     // const rectWidthTime = timePerPixel * RECT_WIDTH_PX;
    //                     const newPrice = linePrice.price;
    //                     const rectTopLeft = {
    //                         time: time,
    //                         price: newPrice + buffer,
    //                     };

    //                     const rectBottomRight = {
    //                         time: time,
    //                         price: newPrice - buffer,
    //                     };

    //                     activeLabel.setPoints([rectTopLeft, rectBottomRight]);
    //                 });
    //             }
    //         }, 100);
    //     }
    // }, [isDrag]);

    const priceToPixel = (
        minPrice: number,
        maxPrice: number,
        chartHeight: number,
    ) => {
        const priceDifference = maxPrice - minPrice;
        const relativePrice = price - minPrice;
        const pixelCoordinate = (relativePrice / priceDifference) * chartHeight;

        return chartHeight - pixelCoordinate; // Yüksekliği ters çevirmek gerekebilir
    };

    useEffect(() => {
        if (chart && orderText) {
            orderText.then((res) => {
                chart
                    .activeChart()
                    .onVisibleRangeChanged()
                    .subscribe(null, ({ from, to }) => {
                        // setUpdatedStartTime({ from: from, to: to });

                        const RECT_WIDTH_PX = 80;
                        const timeScale = chart.activeChart().getTimeScale();

                        const priceScale = chart
                            .activeChart()
                            .getPanes()[0] as any;
                        const chartWidth = Math.floor(timeScale.width() - 50);

                        const activeLabel = chart
                            .activeChart()
                            .getShapeById(res);
                        const priceRange = priceScale
                            .getMainSourcePriceScale()
                            .getVisiblePriceRange();

                        if (!priceRange) return;

                        const maxPrice = priceRange.to;
                        const minPrice = priceRange.from;

                        const diff = maxPrice - Math.abs(minPrice);

                        const chartHeight = priceScale.getHeight();

                        const result = priceToPixel(
                            minPrice,
                            maxPrice,
                            chartHeight,
                        );
                        const pricePerPixel = (result * 1) / chartHeight;

                        const time = chart
                            .activeChart()
                            .getTimeScale()
                            .coordinateToTime(chartWidth) as number;

                        activeLabel.setAnchoredPosition({
                            x: 0.5,
                            y: pricePerPixel,
                        });
                    });
            });
        }
    }, [orderText]);

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
