import React from "react";
import { TradingViewProvider } from "~/contexts/TradingviewContext";
import TradingViewChart from "~/routes/chart/chart";
import LimitOrderLine from "~/routes/chart/orders/LimitOrderLine";

const TradingViewWrapper: React.FC = () => {
  return (
    <TradingViewProvider>
      <TradingViewChart />
      <LimitOrderLine />
    </TradingViewProvider>
  );
};

export default TradingViewWrapper;
