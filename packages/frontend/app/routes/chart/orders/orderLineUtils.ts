type LabelOptions = {
    text: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
};

type DrawSegmentedRectOptions = {
    x: number;
    y: number;
    labelOptions: LabelOptions[];
};

export function drawLabel(
    ctx: CanvasRenderingContext2D,
    { x, y, labelOptions }: DrawSegmentedRectOptions,
) {
    const height = 15;
    ctx.save();
    ctx.font = 'bold 10px sans-serif';
    const padding = 4;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let cursorX = x;

    for (let i = 0; i < labelOptions.length; i++) {
        const { text, backgroundColor, textColor, borderColor } =
            labelOptions[i];
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const segmentWidth = textWidth + padding * 2;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(cursorX, y, segmentWidth, height);

        ctx.strokeStyle = borderColor;
        ctx.strokeRect(cursorX, y, segmentWidth, height);

        ctx.fillStyle = textColor;
        ctx.fillText(text, cursorX + segmentWidth / 2, y + height / 2);

        cursorX += segmentWidth;
    }

    ctx.restore();
}
