import OverlayCanvasLayer from '../OverlayCanvasLayer';

const LiquidationOverlayCanvas: React.FC = () => {
    return (
        <OverlayCanvasLayer id='liqudation-overlay' zIndex={1}>
            {() => <></>}
        </OverlayCanvasLayer>
    );
};

export default LiquidationOverlayCanvas;
