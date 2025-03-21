import { HttpResponse, graphql, http } from "msw";
import globalDataStub from "./stubs/global-data-stub";
import dashboardStub from "./stubs/dashboard-stub";
import prices from "./stubs/prices";
import tokens from "./stubs/tokens";
import coingeckoToken from "./stubs/coingecko-token";

export default [
  graphql.query("GetGlobalData", () => HttpResponse.json(globalDataStub)),
  graphql.query("GetDashboardData", () => HttpResponse.json(dashboardStub)),
  http.get("*/prices", () => HttpResponse.json(prices)),
  http.get("*/tokens", () => HttpResponse.json(tokens)),
  http.get("*/users/:address/bondPurchases", () => HttpResponse.json([])),
  http.get("*/markets/:marketId/bondPurchases", () => HttpResponse.json([])),
  http.get("*/api/v3/coins/:platform/contract/*", () =>
    HttpResponse.json(coingeckoToken)
  ),
];
