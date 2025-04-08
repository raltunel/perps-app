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

export const createShapeText = async (
    chart: any,
    price: number,
    orderSide: 'buy' | 'sell',
    lineType: 'liq' | 'limit' | 'pnl',
) => {
    const orderColor = orderSide === 'buy' ? buyColor : sellColor;

    const priceScalePane = chart.activeChart().getPanes()[0] as any;
    const priceScale = priceScalePane.getMainSourcePriceScale();
    const priceRange = priceScale.getVisiblePriceRange();
    const chartHeight = priceScalePane.getHeight();

    const orderText =
        lineType === 'limit' ? ' Limit  ' + price : '   Liq. Price';

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
        { x: 0.4, price: pricePerPixel },
        {
            shape: 'anchored_text',
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            text: orderText,
            overrides: {
                fontsize: 10,
                backgroundColor: '#D1D1D1',
                bold: true,
                fillBackground: true,
                drawBorder: true,
                borderColor: orderColor,
                wordWrap: true,
                wordWrapWidth: lineType === 'liq' ? 70 : 100,
                borderWidth: 2,
            },
        },
    );

    chart.activeChart().getShapeById(shape).bringToFront();

    return shape;
};

export const createQuantityText = async (
    chart: any,
    price: number,
    quantity: number,
) => {
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
        {
            x: getOrderQuantityTextLocation(chart),
            price: pricePerPixel,
        },
        {
            shape: 'anchored_text',
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            text: quantity,
            overrides: {
                fontsize: 10,
                backgroundColor: '#000000',
                bold: true,
                fillBackground: true,
                drawBorder: true,
                wordWrap: true,
                wordWrapWidth: 50,
                color: '#FFFFFF',
                borderWidth: 3,
                borderColor: '#3C91FF',
            },
        },
    );

    chart.activeChart().getShapeById(shape).bringToFront();

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

export const getOrderQuantityTextLocation = (chart: any) => {
    const timeScale = chart.activeChart().getTimeScale();
    const chartWidth = Math.floor(timeScale.width());

    const wrapWidthPx = 105;

    const offsetX = Number(wrapWidthPx / chartWidth);

    return 0.4 + offsetX;
};
