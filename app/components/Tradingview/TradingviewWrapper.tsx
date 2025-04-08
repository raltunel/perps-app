import React from 'react';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
import OpenOrderLine from '~/routes/chart/orders/openOrderLine';
import PositionsLine from '~/routes/chart/orders/positionsLine';

const TradingViewWrapper: React.FC = () => {
    return (
        <TradingViewProvider>
            <TradingViewChart />
            <OpenOrderLine />
            <PositionsLine/>

        </TradingViewProvider>
    );
};

export default TradingViewWrapper;
