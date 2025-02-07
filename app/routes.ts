// routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Renders "routes/home.tsx" at "/"
  index("routes/home/home.tsx"),

  // Renders "routes/trade.tsx" at "/trade", then nested routes at e.g. "/trade/market"
  route("trade", "routes/trade.tsx", [
    // If you want "/trade" itself to go to "market.tsx":

    // "/trade/market"
    route("market", "routes/trade/market.tsx"),

    // "/trade/limit"
    route("limit", "routes/trade/limit.tsx"),

    // "/trade/pro"
    route("pro", "routes/trade/pro.tsx"),
  ]),
] satisfies RouteConfig;
