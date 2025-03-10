import { HttpResponse, graphql } from "msw";

export default [
  graphql.query("GetGlobalData", () => {
    return HttpResponse.json({
      data: [],
    });
  }),
];
