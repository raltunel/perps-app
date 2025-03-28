import React from "react";
import { TradingViewProvider } from "~/contexts/TradingviewContext";
import TradingViewChart from "~/routes/chart/chart";
import FixedLabelIndicator from "~/routes/chart/FixedLabelIndicator";
import CustomOrderLine from "~/routes/chart/orders/customOrderLine";


const TradingViewWrapper: React.FC = () => {

    
  return (
    <TradingViewProvider>
        <TradingViewChart/>
        {/* <FixedLabelIndicator price={50} label="Resistance 50" /> */}
        <CustomOrderLine/>
    </TradingViewProvider>
  );
};

export default TradingViewWrapper;
