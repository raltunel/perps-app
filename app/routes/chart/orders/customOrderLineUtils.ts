import { color } from 'framer-motion';
const buyColor = '#26A69A';
const sellColor = '#EF5350';
export const addCustomOrderLine = async (chart: any, orderPrice: number) => {
    if (!chart) return;

    const orderLine = chart
        .activeChart()
        .createMultipointShape([{ time: 10, price: orderPrice }], {
            shape: 'horizontal_line',
            lock: false,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            text: 'text',
            overrides: {
              color:buyColor,
              backgroundColor:buyColor,
                linestyle: 3,
                extendLeft: true,
                extendRight: true,
                linewidth:1,
              
            },
        });

    return orderLine;
};

export const addCustomOrderLabel = (chart: any, orderPrice: number) => {
    const chartVisibleRanges = chart.activeChart().getVisibleRange();

    const from = chartVisibleRanges.from + 40 * 24 * 3600;
    const to = chartVisibleRanges.from + 60 * 24 * 3600;
    const buffer = 2000;
    const rectTopLeft = { time: from, price: orderPrice + buffer };
    const rectBottomRight = { time: to, price: orderPrice - buffer };

    const orderLabel = chart
        .activeChart()
        .createMultipointShape([rectTopLeft, rectBottomRight], {
            shape: 'rectangle',
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            text: '   Liq. Price',
            overrides: {
                backgroundColor: 'white',
                color: buyColor,
                fontsize: 8,
                leftEnd: true,
                textAlign: 'left',
            },
        });

    return orderLabel;
};

// export function createFixedRectangle(tvWidget: any,price:number) {
//     const RECT_WIDTH_PX = 80;
//     const RECT_HEIGHT_PX = 30;

//     const priceScale = tvWidget.activeChart().getPanes()[0];

//     const timeScale = tvWidget.activeChart().getTimeScale();

//     const visibleRange = tvWidget.activeChart().getVisibleRange();
//     const priceRange = priceScale
//         .getMainSourcePriceScale()
//         .getVisiblePriceRange();

//     if (!visibleRange || !priceRange) return;

//     const startTime = visibleRange.from;
//     const endTime = visibleRange.to;

//     const minPrice = priceRange.from;
//     const maxPrice = priceRange.to;

//     const chartWidth = Math.floor(timeScale.width());
//     const chartHeight = priceScale.getHeight();

//     const timePerPixel = Math.floor((endTime - startTime) / chartWidth);
//     const rectWidthTime = timePerPixel * RECT_WIDTH_PX;

//     const pricePerPixel = Math.floor((maxPrice - minPrice) / chartHeight);
//     const rectHeightPrice = pricePerPixel * RECT_HEIGHT_PX;

//     const rectTopLeft = { time: startTime, price: price };
//     const rectBottomRight = {
//         time: startTime + rectWidthTime,
//         price: price + rectHeightPrice,
//     };

//     const shape = tvWidget
//         .activeChart()
//         .createMultipointShape([rectTopLeft, rectBottomRight], {
//             shape: 'rectangle',
//             lock: true,
//             disableSelection: true,
//             disableSave: true,
//             disableUndo: true,
//             text: 'Limit',
//             overrides: {
//                 backgroundColor: 'white',
//                 color: buyColor,
//                 fontsize: 8,
//                 leftEnd: true,
//                 textAlign: 'left',
//             },
//         });
// }

export const createShapeText = (chart: any, price: number) => {
    const RECT_WIDTH_PX = 80;
    const RECT_HEIGHT_PX = 4.5;

    const priceScale = chart.activeChart().getPanes()[0];

    const timeScale = chart.activeChart().getTimeScale();

    const visibleRange = chart.activeChart().getVisibleRange();

    const priceRange = priceScale
        .getMainSourcePriceScale()
        .getVisiblePriceRange();

    if (!visibleRange || !priceRange) return;

    const startTime = visibleRange.from;
    const endTime = visibleRange.to;

    const minPrice = priceRange.from;
    const maxPrice = priceRange.to;

    const chartWidth = Math.floor(timeScale.width());

    const timePerPixel = Math.floor((endTime - startTime) / chartWidth);
    const rectWidthTime = timePerPixel * RECT_WIDTH_PX;
    const chartHeight = priceScale.getHeight();
    const pricePerPixel = Math.floor((maxPrice - minPrice) / chartHeight);
    const rectHeightPrice = pricePerPixel * RECT_HEIGHT_PX;
    const shape= chart.activeChart().createShape(
        { time: startTime + rectWidthTime, price: price + rectHeightPrice },
        {
            shape: 'text',
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true
            ,
            text: '   Liq. Price',
            overrides: {
                fontsize: 10,
                backgroundColor: '#FFFFFF',
                bold: true,
                fillBackground: true,
                drawBorder: true,
                borderColor: buyColor,
                wordWrap: true,
                wordWrapWidth: 60,
                borderWidth:2,
            },
        },
    );

    return shape;
};
