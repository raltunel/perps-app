import React from 'react';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
import CustomOrderLine from '~/routes/chart/orders/customOrderLine';
import { useTradeDataStore } from '~/stores/TradeDataStore';

const TradingViewWrapper: React.FC = () => {
    const { userSymbolOrders } = useTradeDataStore();

    return (
        <TradingViewProvider>
            <TradingViewChart />
            <CustomOrderLine data={userSymbolOrders} orderType='limit' />
        </TradingViewProvider>
    );
};

export default TradingViewWrapper;
