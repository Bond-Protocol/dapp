import { HttpResponse, graphql } from "msw";
import globalDataStub from "./stubs/global-data-stub";

export default [
  graphql.query("GetGlobalData", () => {
    return HttpResponse.json(globalDataStub);
  }),
];
