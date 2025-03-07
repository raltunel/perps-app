import { useEffect, useState } from "react";
import { useTradingView } from "~/contexts/TradingviewContext";
import { addOrderLine } from "./OrderLineUtils";

const LimitOrderLine = () => {
  const { chart } = useTradingView();

  const orderPrices = [
    { price: 86872, quantity: "640" },
    { price: 78918, quantity: "710" },
    { price: 95800, quantity: "897" },
    { price: 100000, quantity: "668" },
  ];

  useEffect(() => {
    if (chart) {
      orderPrices.forEach((orders) => {
        const isSell = orders.price > 88000;
        addOrderLine(chart, orders.price, orders.quantity, isSell);
      });
    }
  }, [chart]);

  return null;
};

export default LimitOrderLine;
