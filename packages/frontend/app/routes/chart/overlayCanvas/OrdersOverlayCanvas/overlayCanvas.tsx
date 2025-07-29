import OrderLines from '../../orders/OrderLines';
import OverlayCanvasLayer from '../OverlayCanvasLayer';

const OverlayCanvas: React.FC = () => {
    return (
        <OverlayCanvasLayer id='order-overlay' zIndex={0}>
            {({ canvasRef, canvasSize, scaleData, mousePositionRef }) => (
                <OrderLines
                    overlayCanvasRef={canvasRef}
                    canvasSize={canvasSize}
                    scaleData={scaleData}
                    overlayCanvasMousePositionRef={mousePositionRef}
                />
            )}
        </OverlayCanvasLayer>
    );
};

export default OverlayCanvas;
