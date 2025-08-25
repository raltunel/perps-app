import LiqComponent from '../liqudation/LiqComponent';
import OverlayCanvasLayer from './overlayCanvasLayer';

const LiquidationOverlayCanvas: React.FC = () => {
    return (
        <OverlayCanvasLayer id='liquidation-overlay' zIndex={5}>
            {({ canvasRef, canvasSize, scaleData }) => (
                <LiqComponent
                    overlayCanvasRef={canvasRef}
                    canvasSize={canvasSize}
                    scaleData={scaleData}
                />
            )}
        </OverlayCanvasLayer>
    );
};

export default LiquidationOverlayCanvas;
