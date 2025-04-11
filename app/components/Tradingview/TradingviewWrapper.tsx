import React from 'react';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
import OpenOrderLine from '~/routes/chart/orders/openOrderLine';
import PnlOrderLine from '~/routes/chart/orders/pnlLine';

const TradingViewWrapper: React.FC = () => {
    return (
        <TradingViewProvider>
            <TradingViewChart />
            <OpenOrderLine />
            <PnlOrderLine />
        </TradingViewProvider>
    );
};

export default TradingViewWrapper;
