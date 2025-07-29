import { useTradingView } from '~/contexts/TradingviewContext';
import OverlayCanvasLayer from '../OverlayCanvasLayer';
import { useAppStateStore } from '~/stores/AppStateStore';

const LiquidationOverlayCanvas: React.FC = () => {
    const { liquidationsActive } = useAppStateStore();

    return (
        liquidationsActive && (
            <OverlayCanvasLayer id='liquidation-overlay' zIndex={1}>
                {() => <></>}
            </OverlayCanvasLayer>
        )
    );
};

export default LiquidationOverlayCanvas;
