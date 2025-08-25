import LiqudationLines from './LiqudationLines';

export interface LiqProps {
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasSize: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scaleData: any;
}

const LiqComponent = ({
    overlayCanvasRef,
    canvasSize,
    scaleData,
}: LiqProps) => {
    return (
        <LiqudationLines
            canvasSize={canvasSize}
            overlayCanvasRef={overlayCanvasRef}
            scaleData={scaleData}
        />
    );
};

export default LiqComponent;
