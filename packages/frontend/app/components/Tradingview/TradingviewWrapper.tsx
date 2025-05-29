import React from 'react';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
import OverlayCanvas from '~/routes/chart/overlayCanvas/overlayCanvas';

const TradingViewWrapper: React.FC = () => {
    return (
        <TradingViewProvider>
            <TradingViewChart />
            <OverlayCanvas />
        </TradingViewProvider>
    );
};

export default TradingViewWrapper;
