import { HttpResponse, graphql, http } from "msw";
import globalDataStub from "./stubs/global-data-stub";
import dashboardStub from "./stubs/dashboard-stub";
import prices from "./stubs/prices";
import tokens from "./stubs/tokens";
import coingeckoToken from "./stubs/coingecko-token";
import defillamaChart from "./stubs/defillama-chart";
import closedMarkets from "./stubs/closed-markets";

export default [
  graphql.query("GetGlobalData", () => HttpResponse.json(globalDataStub)),
  graphql.query("GetDashboardData", () => HttpResponse.json(dashboardStub)),
  graphql.query("getClosedMarkets", () => HttpResponse.json(closedMarkets)),
  http.get("*/prices", () => HttpResponse.json(prices)),
  http.get("*/tokens", () => HttpResponse.json(tokens)),

  http.get("*/users/:address/bondPurchases", () => HttpResponse.json([])),
  http.get("*/markets/:marketId/bondPurchases", () =>
    HttpResponse.json({
      bondPurchases: [],
      averageDiscount: "0",
      tbvUsd: 0,
    })
  ),
  http.get("*/api/v3/coins/:platform/contract/*", () =>
    HttpResponse.json(coingeckoToken)
  ),
  http.get("https://coins.llama.fi/chart/*", () => {
    return HttpResponse.json(defillamaChart);
  }),
];
