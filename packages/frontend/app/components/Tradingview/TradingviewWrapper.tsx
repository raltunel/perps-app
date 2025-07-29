import React from 'react';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
import LiquidationOverlayCanvas from '~/routes/chart/overlayCanvas/LiquidationOverlayCanvas/liquidationOverlayCanvas';
import OverlayCanvas from '~/routes/chart/overlayCanvas/OrdersOverlayCanvas/overlayCanvas';

const TradingViewWrapper: React.FC = () => {
    return (
        <TradingViewProvider>
            <TradingViewChart />
            <OverlayCanvas />
            <LiquidationOverlayCanvas />
        </TradingViewProvider>
    );
};

export default TradingViewWrapper;
