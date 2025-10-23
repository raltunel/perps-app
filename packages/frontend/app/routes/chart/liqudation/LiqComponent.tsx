import LiquidationsChart from '~/routes/trade/liquidationsChart/LiquidationOBChart';
import { useLiqudationLines } from './hooks/useLiquidationLines';
import LiqLineTooltip from './LiqLinesTooltip';
import LiqudationLines, { type HorizontalLineData } from './LiqudationLines';
import { useOrderBookStore } from '~/stores/OrderBookStore';
import { useEffect, useState } from 'react';

export interface LiqProps {
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    canvasWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasSize: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scaleData: any;
    zoomChanged: boolean;
}

const LiqComponent = ({
    overlayCanvasRef,
    canvasWrapperRef,
    canvasSize,
    scaleData,
    zoomChanged,
}: LiqProps) => {
    const lines = useLiqudationLines(scaleData);

    const { highResBuys, highResSells, liqBuys, liqSells } =
        useOrderBookStore();

    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);

    useEffect(() => {
        const canvasRect = overlayCanvasRef.current?.getBoundingClientRect();
        if (canvasRect) {
            setTop(canvasRect.top);
            setLeft(canvasRect.left);
        }
        console.log({ canvasRect });
    }, [canvasSize]);

    return (
        <>
            {canvasSize && (
                <div
                    id='liq-mobile'
                    style={{
                        position: 'absolute',
                        top: top,
                        left: left,
                        pointerEvents: 'none',
                        width: canvasSize.width,
                        height: canvasSize.height,
                        overflow: 'hidden',
                    }}
                >
                    <LiquidationsChart
                        buyData={highResBuys}
                        sellData={highResSells}
                        liqBuys={liqBuys}
                        liqSells={liqSells}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        scaleData={scaleData}
                        location={'liqMobile'}
                    />
                </div>
            )}
            <LiqLineTooltip
                canvasWrapperRef={canvasWrapperRef}
                overlayCanvasRef={overlayCanvasRef}
                scaleData={scaleData}
                lines={lines}
            />
            <LiqudationLines
                canvasSize={canvasSize}
                overlayCanvasRef={overlayCanvasRef}
                canvasWrapperRef={canvasWrapperRef}
                scaleData={scaleData}
                zoomChanged={zoomChanged}
                lines={lines}
            />
        </>
    );
};

export default LiqComponent;
