import {
  mainnetEndpoints,
  testnetEndpoints,
} from "services/subgraph-endpoints";
import { environment } from "src/environment";
import { request } from "./request";
import { Variables } from "graphql-request";
import { GRAPH_API_KEY } from "src/config";

export function queryAllEndpoints<TQuery>({
  document,
  variables,
  enabled = true,
  headers = { Authorization: `Bearer ${GRAPH_API_KEY}` },
}: {
  document: string;
  variables?: Variables;
  enabled?: boolean;
  headers?: Record<string, string>;
}) {
  const isTestnet = environment.isTestnet;
  const endpoints = isTestnet ? testnetEndpoints : mainnetEndpoints;
  const currentTime = Math.trunc(Date.now() / 1000);

  const vars = variables || {
    currentTime: currentTime,
  };

  const queries = endpoints.map(({ url }) => ({
    queryKey: [url, document],
    queryFn: async () => {
      const response = await request<TQuery>(url, document, vars, headers);
      return response;
    },

    enabled,
  }));

  return queries;
}
