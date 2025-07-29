import { useTradingView } from '~/contexts/TradingviewContext';
import OverlayCanvasLayer from '../OverlayCanvasLayer';

const LiquidationOverlayCanvas: React.FC = () => {
    const { isLiqChartVisible } = useTradingView();

    return (
        isLiqChartVisible && (
            <OverlayCanvasLayer id='liquidation-overlay' zIndex={1}>
                {() => <></>}
            </OverlayCanvasLayer>
        )
    );
};

export default LiquidationOverlayCanvas;
