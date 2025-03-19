import { HttpResponse, graphql } from "msw";
import globalDataStub from "./stubs/global-data-stub";
import dashboardStub from "./stubs/dashboard-stub";

export default [
  graphql.query("GetGlobalData", () => HttpResponse.json(globalDataStub)),
  graphql.query("GetDashboardData", () => HttpResponse.json(dashboardStub)),
];
