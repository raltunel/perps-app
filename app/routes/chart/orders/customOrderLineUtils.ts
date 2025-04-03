export const buyColor = '#26A69A';
export const sellColor = '#E57373';
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
            overrides: {
                linecolor: sellColor,
                borderColor: sellColor,
                linestyle: 3,
                extendLeft: true,
                extendRight: true,
                linewidth: 1,
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

export const createShapeText = (chart: any, price: number) => {
    const priceScale = chart.activeChart().getPanes()[0];

    const timeScale = chart.activeChart().getTimeScale();

    const visibleRange = chart.activeChart().getVisibleRange();

    const priceRange = priceScale
        .getMainSourcePriceScale()
        .getVisiblePriceRange();

    if (!visibleRange || !priceRange) return;

    const startTime = visibleRange.from;
    const endTime = visibleRange.to;

    const chartWidth = Math.floor(timeScale.width());
    const RECT_WIDTH_PX = chartWidth / 2;

    const timePerPixel = Math.floor((endTime - startTime) / chartWidth);
    const rectWidthTime = timePerPixel * RECT_WIDTH_PX;
    const shape = chart.activeChart().createShape(
        { time: startTime + rectWidthTime, price: price },
        {
            shape: 'anchored_text',
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            text: '   Liq. Price',
            overrides: {
                fontsize: 10,
                backgroundColor: '#D1D1D1',
                bold: true,
                fillBackground: true,
                drawBorder: true,
                borderColor: sellColor,
                wordWrap: true,
                wordWrapWidth: 60,
                borderWidth: 2,
            },
        },
    );

    return shape;
};
