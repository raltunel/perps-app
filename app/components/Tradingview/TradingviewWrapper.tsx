import React from "react";
import { TradingViewProvider } from "~/contexts/TradingviewContext";
import TradingViewChart from "~/routes/chart/chart";
import CustomOrderLine from "~/routes/chart/orders/customOrderLine";


const TradingViewWrapper: React.FC = () => {

    
  return (
    <TradingViewProvider>
        <TradingViewChart/>
        <CustomOrderLine/>
    </TradingViewProvider>
  );
};

export default TradingViewWrapper;
