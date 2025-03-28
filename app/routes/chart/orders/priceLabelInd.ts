export function addPriceLabelIndicator(chart: any, price: number) {
    const shape = chart.activeChart().createShape(
        { price },
        {
            shape: 'horizontal_line',
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            zOrder: 'top',
            overrides: {
                color: '#FF0000', // Kırmızı çizgi
                linewidth: 2,
                linestyle: 0, // Düz çizgi
            },
        },
    );

    const timeScale = chart.activeChart().getTimeScale();
    const xCoordinate = timeScale.width() - 50; // X ekseninde sağa sabitleme

    const label = chart.activeChart().createShape(
        { time: 1000000, y:90000 }, // X ekseninde sabit, Y ekseninde fiyat bağlı
        {
            shape: 'text',
            text: `Fiyat: ${price.toFixed(2)}`,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            zOrder: 'top',
            overrides: {
                backgroundColor: '#FF0000',
                color: '#FFFFFF',
                fontSize: 14,
                bold: true,
                vertAlign: 'center',
                horzAlign: 'right', // X ekseninde sabit kalmasını sağlar
            },
        },
    );

    return { shape, label };
}
