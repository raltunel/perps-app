import type { IChartingLibraryWidget, IPaneApi } from '~/tv/charting_library';

export const buyColor = '#26A69A';
export const sellColor = '#E57373';

export const addCustomOrderLine = async (
    chart: IChartingLibraryWidget,
    orderPrice: number,
    lineColor: string,
) => {
    const orderLine = await chart
        .activeChart()
        .createMultipointShape([{ time: 10, price: orderPrice }], {
            shape: 'horizontal_line',
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            overrides: {
                linecolor: lineColor,
                borderColor: lineColor,
                linestyle: 3,
                linewidth: 1,
            },
        });

    chart.activeChart().getShapeById(orderLine).sendToBack();
    return orderLine;
};

export const priceToPixel = (chart: IChartingLibraryWidget, price: number) => {
    const textHeight = 15;
    let pixel = 0;

    const priceScalePane = chart.activeChart().getPanes()[0] as IPaneApi;

    const priceScale = priceScalePane.getMainSourcePriceScale();
    if (priceScale) {
        const priceRange = priceScale.getVisiblePriceRange();
        const chartHeight = priceScalePane.getHeight();

        if (!priceRange) return 0;

        const maxPrice = priceRange.to;
        const minPrice = priceRange.from;
        const isLogarithmic = priceScale.getMode() === 1;
        if (isLogarithmic) {
            const logMinPrice = Math.log(minPrice);
            const logMaxPrice = Math.log(maxPrice);
            const logPrice = Math.log(price);

            const priceDifference = logMaxPrice - logMinPrice;
            const relativePrice = logPrice - logMinPrice;
            const pixelCoordinate =
                (relativePrice / priceDifference) * chartHeight;

            pixel = chartHeight - pixelCoordinate - textHeight / 2;
        } else {
            const priceDifference = maxPrice - minPrice;
            const relativePrice = price - minPrice;
            const pixelCoordinate =
                (relativePrice / priceDifference) * chartHeight;

            pixel = chartHeight - pixelCoordinate - textHeight / 2;
        }

        return pixel / chartHeight;
    }

    return 0;
};

export const getAnchoredQuantityTextLocation = (
    chart: IChartingLibraryWidget,
    bufferX: number,
    orderText: string,
) => {
    const timeScale = chart.activeChart().getTimeScale();
    const chartWidth = Math.floor(timeScale.width());

    const wrapWidthPx = orderText.length > 13 ? 100 : 70;

    const offsetX = Number(wrapWidthPx / chartWidth);

    return bufferX + offsetX;
};

export const createAnchoredMainText = async (
    chart: IChartingLibraryWidget,
    xLoc: number,
    yPrice: number,
    text: string,
    borderColor: string,
) => {
    return createAnchoredText(
        chart,
        xLoc,
        yPrice,
        text,
        '#D1D1D1',
        text.toString().length > 13 ? 100 : 70,
        borderColor,
    );
};

export const createQuantityAnchoredText = async (
    chart: IChartingLibraryWidget,
    xLoc: number,
    yPrice: number,
    text: string,
) => {
    return createAnchoredText(
        chart,
        xLoc,
        yPrice,
        text,
        '#000000',
        text.toString().length > 8 ? 70 : 60,
        '#3C91FF',
        '#FFFFFF',
    );
};

export const createAnchoredText = async (
    chart: IChartingLibraryWidget,
    xLoc: number,
    yPrice: number,
    text: string,
    backgroundColor: string,
    wordWrapWidth: number,
    borderColor: string,
    color?: string,
) => {
    const shape = await chart.activeChart().createAnchoredShape(
        {
            x: xLoc,
            y: priceToPixel(chart, yPrice),
        },
        {
            shape: 'anchored_text',
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            text: text,
            overrides: {
                fontsize: 10,
                backgroundColor: backgroundColor,
                bold: true,
                fillBackground: true,
                drawBorder: true,
                wordWrap: true,
                wordWrapWidth: wordWrapWidth,
                color: color,
                borderWidth: 3,
                borderColor: borderColor,
                zOrder: 'top',
            },
        },
    );

    chart.activeChart().getShapeById(shape).bringToFront();

    return shape;
};

export const quantityTextFormatWithComma = (value: number): string => {
    const isNegative = value < 0;
    const [integerPart, decimalPart] = Math.abs(value).toString().split('.');

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let result = formattedInteger;
    if (decimalPart !== undefined) {
        result += '.' + decimalPart;
    }

    return isNegative ? `-${result}` : result;
};
