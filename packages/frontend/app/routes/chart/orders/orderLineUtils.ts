export type LabelType = 'Main' | 'Quantity' | 'Cancel';
type LabelOptions = {
    text: string;
    type: LabelType;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
};

type DrawSegmentedRectOptions = {
    x: number;
    y: number;
    labelOptions: LabelOptions[];
};

export type LabelLocation = {
    type: LabelType;
    x: number;
    y: number;
    width: number;
    height: number;
};

export function drawLabel(
    ctx: CanvasRenderingContext2D,
    { x, y, labelOptions }: DrawSegmentedRectOptions,
) {
    const dpr = window.devicePixelRatio || 1;
    const height = 15 * dpr;

    ctx.save();
    ctx.font = `bold ${10 * dpr}px sans-serif`;
    const padding = 4;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let cursorX = x;
    const labelLocations: LabelLocation[] = [];

    for (let i = 0; i < labelOptions.length; i++) {
        const { text, backgroundColor, textColor, borderColor, type } =
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

        labelLocations.push({
            type,
            x: cursorX,
            y,
            width: segmentWidth,
            height,
        });
        cursorX += segmentWidth;
    }

    ctx.restore();

    return labelLocations;
}

// export function drawLiqLabel(
//     ctx: CanvasRenderingContext2D,
//     { x, y /* labelOptions */ }: DrawSegmentedRectOptions,
// ) {
//     const dpr = window.devicePixelRatio || 1;
//     const height = 18 * dpr;

//     const width = 120 * dpr;
//     const radius = 2 * dpr;

//     ctx.beginPath();
//     ctx.moveTo(x + radius, y);
//     ctx.lineTo(x + width - radius, y);
//     ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//     ctx.lineTo(x + width, y + height - radius);
//     ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//     ctx.lineTo(x + radius, y + height);
//     ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//     ctx.lineTo(x, y + radius);
//     ctx.quadraticCurveTo(x, y, x + radius, y);
//     ctx.closePath();

//     ctx.fillStyle = '#D1D1D1';
//     ctx.strokeStyle = '#EF5350';
//     ctx.lineWidth = 2;
//     ctx.fill();

//     const iconX = x + 10;
//     const iconY = y + 1;
//     const size = 15 * dpr;

//     ctx.beginPath();
//     ctx.moveTo(iconX + size / 2, iconY);
//     ctx.lineTo(iconX, iconY + size);
//     ctx.lineTo(iconX + size, iconY + size);
//     ctx.closePath();
//     ctx.fillStyle = '#EF5350';
//     ctx.fill();

//     // !
//     ctx.fillStyle = 'white';
//     ctx.font = `bold ${12 * dpr}px sans-serif`;

//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText('!', iconX + size / 2, iconY + size * 0.65);

//     // "Liq. Price"
//     ctx.textAlign = 'left';
//     ctx.fillStyle = '#eb403eff';
//     ctx.font = `bold ${15 * dpr}px sans-serif`;

//     ctx.fillText('Liq. Price', x + 40, y + 2 + height / 2);
//     const labelLocations: LabelLocation[] = [];

//     ctx.restore();

//     return labelLocations;
// }
export function drawLiqLabel(
    ctx: CanvasRenderingContext2D,
    { x, y, labelOptions }: DrawSegmentedRectOptions,
    chartWidth: number,
) {
    const dpr = window.devicePixelRatio || 1;
    const height = 18 * dpr;

    // const textWidth = 120 * dpr;
    // const segmentWidth = textWidth + 4 * 2 + 15;
    // ctx.fillStyle = 'rgba(255, 193, 7, 0.1)';
    // ctx.fillRect(x, y, segmentWidth, height);

    // ctx.globalAlpha = 0.2;
    // ctx.fillStyle = 'black';
    // const stripeWidth = 20;
    // const stripeSpacing = 10;
    // const totalStripe = Math.ceil(chartWidth / (stripeWidth + stripeSpacing));

    // for (let i = -totalStripe; i < totalStripe * 2; i++) {
    //     const _x = i * (stripeWidth + stripeSpacing);

    //     ctx.save();
    //     ctx.translate(_x, 0);
    //     // ctx.rotate(angle);
    //     ctx.fillRect(x, y, segmentWidth, height);
    //     ctx.restore();
    // }

    // ctx.globalAlpha = 1.0;

    // ctx.restore();

    ctx.save();
    ctx.font = `bold ${11 * dpr}px sans-serif`;
    const padding = 4;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let cursorX = x;
    const labelLocations: LabelLocation[] = [];

    for (let i = 0; i < labelOptions.length; i++) {
        const { text, backgroundColor, type } = labelOptions[i];
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const segmentWidth = textWidth + padding * 2 + 15; /* + 50; */

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(cursorX, y, segmentWidth, height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#EF5350';
        ctx.strokeRect(cursorX, y, segmentWidth, height);

        const iconY = y + 2;
        ctx.fillStyle = '#EF5350';
        ctx.fillText(text, x + segmentWidth / 2, iconY + height / 2);

        const iconX = chartWidth - 15;
        const radius = 10;

        ctx.beginPath();
        ctx.arc(iconX, y + height / 2, 12, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(iconX, y + height / 2, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFC107';
        ctx.fill();

        // !
        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', iconX, y + 1 + height / 2);

        labelLocations.push({
            type,
            x: cursorX,
            y,
            width: segmentWidth,
            height,
        });
        cursorX += segmentWidth;
    }

    return labelLocations;
}

export function drawLiqLabel2(
    ctx: CanvasRenderingContext2D,
    { x, y, labelOptions }: DrawSegmentedRectOptions,
    chartWidth: number,
) {
    const dpr = window.devicePixelRatio || 1;
    const height = 18 * dpr;

    ctx.save();
    ctx.font = `bold ${11 * dpr}px sans-serif`;
    const padding = 4;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let cursorX = x;
    const labelLocations: LabelLocation[] = [];

    for (let i = 0; i < labelOptions.length; i++) {
        const { text, backgroundColor, borderColor, type } = labelOptions[i];
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const segmentWidth = textWidth + padding * 2 + 50;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(cursorX, y, segmentWidth, height);

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(cursorX, y, segmentWidth, height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(cursorX, y, segmentWidth, height);

        const iconX = x + 10;
        const iconY = y + 2;
        const size = 15 * dpr;

        ctx.beginPath();
        ctx.moveTo(iconX + size / 2, iconY);
        ctx.lineTo(iconX, iconY + size);
        ctx.lineTo(iconX + size, iconY + size);
        ctx.closePath();
        ctx.fillStyle = '#FFC107';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        // !
        ctx.fillStyle = 'black';
        ctx.font = `bold ${12 * dpr}px sans-serif`;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', iconX + size / 2, iconY + size * 0.65);

        ctx.fillStyle = 'black';
        ctx.fillText(text, iconX + segmentWidth / 2, iconY + height / 2);

        labelLocations.push({
            type,
            x: cursorX,
            y,
            width: segmentWidth,
            height,
        });
        cursorX += segmentWidth;
    }

    ctx.restore();

    return labelLocations;
}

export function drawLiqLabel3(
    ctx: CanvasRenderingContext2D,
    { x, y, labelOptions }: DrawSegmentedRectOptions,
    chartWidth: number,
) {
    const dpr = window.devicePixelRatio || 1;
    const height = 18 * dpr;

    ctx.save();
    ctx.font = `bold ${11 * dpr}px sans-serif`;
    const padding = 4;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let cursorX = x;
    const labelLocations: LabelLocation[] = [];

    for (let i = 0; i < labelOptions.length; i++) {
        const { text, backgroundColor, type } = labelOptions[i];
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const segmentWidth = textWidth + padding * 2 + 15; /* + 50; */

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(cursorX, y, segmentWidth, height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#EF5350';
        ctx.strokeRect(cursorX, y, segmentWidth, height);

        ctx.stroke();

        const iconY = y + 2;
        ctx.fillStyle = '#EF5350';

        ctx.fillStyle = '';
        ctx.fillText(text, x + segmentWidth / 2, iconY + height / 2);

        const iconX = chartWidth - 15;
        const radius = 10;

        ctx.beginPath();
        ctx.arc(iconX, y + height / 2, 12, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(iconX, y + height / 2, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#EF5350';
        ctx.fill();

        // !
        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', iconX, y + 1 + height / 2);

        labelLocations.push({
            type,
            x: cursorX,
            y,
            width: segmentWidth,
            height,
        });
        cursorX += segmentWidth;
    }

    ctx.restore();

    return labelLocations;
}

export function drawLiqLabel4(
    ctx: CanvasRenderingContext2D,
    { x, y, labelOptions }: DrawSegmentedRectOptions,
    chartWidth: number,
) {
    const dpr = window.devicePixelRatio || 1;
    const height = 18 * dpr;

    ctx.save();
    ctx.font = `bold ${11 * dpr}px sans-serif`;
    const padding = 4;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let cursorX = x;
    const labelLocations: LabelLocation[] = [];

    for (let i = 0; i < labelOptions.length; i++) {
        const { text, backgroundColor, type } = labelOptions[i];
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const segmentWidth = textWidth + padding * 2 + 15; /* + 50; */

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(cursorX, y, segmentWidth, height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#EF5350';
        ctx.strokeRect(cursorX, y, segmentWidth, height);

        const iconY = y + 2;
        ctx.fillStyle = '#EF5350';
        ctx.fillText(text, x + segmentWidth / 2, iconY + height / 2);

        const iconX = chartWidth - 15;
        const radius = 10;

        ctx.beginPath();
        ctx.arc(iconX, y + height / 2, 12, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(iconX, y + height / 2, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFC107';
        ctx.fill();

        // !
        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', iconX, y + 1 + height / 2);

        labelLocations.push({
            type,
            x: cursorX,
            y,
            width: segmentWidth,
            height,
        });
        cursorX += segmentWidth;
    }

    ctx.restore();

    return labelLocations;
}

export function drawLiqLabel5(
    ctx: CanvasRenderingContext2D,
    { x, y, labelOptions }: DrawSegmentedRectOptions,
    chartWidth: number,
) {
    const dpr = window.devicePixelRatio || 1;
    const height = 18 * dpr;
    ctx.fillStyle = 'rgba(255, 193, 7, 0.1)';
    ctx.fillRect(0, y, chartWidth, height);

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'black';
    const stripeWidth = 20;
    const stripeSpacing = 10;
    const totalStripe = Math.ceil(chartWidth / (stripeWidth + stripeSpacing));

    for (let i = -totalStripe; i < totalStripe * 2; i++) {
        const x = i * (stripeWidth + stripeSpacing);

        ctx.save();
        ctx.translate(x, 0);
        // ctx.rotate(angle);
        ctx.fillRect(0, y, stripeWidth, height);
        ctx.restore();
    }

    ctx.globalAlpha = 1.0;

    ctx.restore();

    ctx.save();
    ctx.font = `bold ${11 * dpr}px sans-serif`;
    const padding = 4;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let cursorX = x;
    const labelLocations: LabelLocation[] = [];

    for (let i = 0; i < labelOptions.length; i++) {
        const { text, backgroundColor, type } = labelOptions[i];
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const segmentWidth = textWidth + padding * 2 + 15; /* + 50; */

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(cursorX, y, segmentWidth, height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#EF5350';
        ctx.strokeRect(cursorX, y, segmentWidth, height);

        const iconY = y + 2;
        ctx.fillStyle = '#EF5350';
        ctx.fillText(text, x + segmentWidth / 2, iconY + height / 2);

        const iconX = chartWidth - 15;
        const radius = 10;

        ctx.beginPath();
        ctx.arc(iconX, y + height / 2, 12, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(iconX, y + height / 2, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFC107';
        ctx.fill();

        // !
        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', iconX, y + 1 + height / 2);

        labelLocations.push({
            type,
            x: cursorX,
            y,
            width: segmentWidth,
            height,
        });
        cursorX += segmentWidth;
    }

    return labelLocations;
}
