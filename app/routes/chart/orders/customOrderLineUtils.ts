export const buyColor = '#26A69A';
export const sellColor = '#E57373';
export const addCustomOrderLine = async (
    chart: any,
    orderPrice: number,
    orderSide: 'buy' | 'sell',
) => {
    if (!chart) return;
    const orderColor = orderSide === 'buy' ? buyColor : sellColor;

    const orderLine = await chart
        .activeChart()
        .createMultipointShape([{ time: 10, price: orderPrice }], {
            shape: 'horizontal_line',
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            overrides: {
                linecolor: orderColor,
                borderColor: orderColor,
                linestyle: 3,
                extendLeft: true,
                extendRight: true,
                linewidth: 1,
            },
        });

    return orderLine;
};

export const addCustomOrderLabel = (
    chart: any,
    orderPrice: number,
    orderSide: 'buy' | 'sell',
) => {
    const chartVisibleRanges = chart.activeChart().getVisibleRange();
    const orderColor = orderSide === 'buy' ? buyColor : sellColor;

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
                color: orderColor,
                fontsize: 8,
                leftEnd: true,
                textAlign: 'left',
            },
        });

    return orderLabel;
};

export const createShapeText = async (
    chart: any,
    price: number,
    orderSide: 'buy' | 'sell',
    lineType: 'liq' | 'limit' | 'pnl'
) => {
    const orderColor = orderSide === 'buy' ? buyColor : sellColor;

    const priceScalePane = chart.activeChart().getPanes()[0] as any;
    const priceScale = priceScalePane.getMainSourcePriceScale();
    const priceRange = priceScale.getVisiblePriceRange();
    const chartHeight = priceScalePane.getHeight();

    if (!priceRange) return;

    const maxPrice = priceRange.to;
    const minPrice = priceRange.from;

    const pixel = priceToPixel(
        minPrice,
        maxPrice,
        chartHeight,
        price,
        priceScale.getMode() === 1,
    );

    const pricePerPixel = (pixel * 1) / chartHeight;

    const shape = await chart.activeChart().createShape(
        { x: 0.2, price: pricePerPixel },
        {
            shape: 'anchored_text',
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            text: lineType === "limit" ?' Limit  '+ price : '   Liq. Price',
            overrides: {
                fontsize: 10,
                backgroundColor: '#D1D1D1',
                bold: true,
                fillBackground: true,
                drawBorder: true,
                borderColor: orderColor,
                wordWrap: true,
                wordWrapWidth: 70,
                borderWidth: 2,
            },
        },
    );

    return shape;
};

export const priceToPixel = (
    minPrice: number,
    maxPrice: number,
    chartHeight: number,
    price: number,
    isLogarithmic: boolean = false,
) => {
    const textHeight = 10;

    if (isLogarithmic) {
        const logMinPrice = Math.log(minPrice);
        const logMaxPrice = Math.log(maxPrice);
        const logPrice = Math.log(price);

        const priceDifference = logMaxPrice - logMinPrice;
        const relativePrice = logPrice - logMinPrice;
        const pixelCoordinate = (relativePrice / priceDifference) * chartHeight;

        return chartHeight - pixelCoordinate - textHeight / 2;
    } else {
        const priceDifference = maxPrice - minPrice;
        const relativePrice = price - minPrice;
        const pixelCoordinate = (relativePrice / priceDifference) * chartHeight;

        return chartHeight - pixelCoordinate - textHeight / 2;
    }
};
