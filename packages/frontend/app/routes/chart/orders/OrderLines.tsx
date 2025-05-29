import React from 'react';
import { useOpenOrderLines } from './useOpenOrderLines';
import { usePositionOrderLines } from './usePositionOrderLines';
import LineComponent from './component/LineComponent';
import LabelComponent from './component/LabelComponent';

export type OrderLinesProps = {
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

export default function OrderLines({ overlayCanvasRef }: OrderLinesProps) {
    const openLines = useOpenOrderLines();
    const positionLines = usePositionOrderLines();

    const combinedData = [...openLines, ...positionLines];

    return (
        <>
            <LineComponent key='pnl' lines={combinedData} />;
            <LabelComponent
                key='pnl-label'
                lines={combinedData}
                overlayCanvasRef={overlayCanvasRef}
            />
        </>
    );
}
