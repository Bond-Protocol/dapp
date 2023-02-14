import { CHAIN_ID } from "@bond-protocol/bond-library";
import { UseQueryResult } from "react-query";
import { environment } from "src/environment";
import { mainnetEndpoints, testnetEndpoints } from "./subgraph-endpoints";

const testnet = environment.isTestnet;
const endpoints = testnet ? testnetEndpoints : mainnetEndpoints;

export const getSubgraphQueries = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  variables?: {}
): UseQueryResult<any, any>[] => {
  const queries: UseQueryResult<any, any>[] = [];
  endpoints.forEach((endpoint) => {
    queries.push(
      query(
        { endpoint: endpoint.url },
        { queryKey: endpoint.url + "--" + query.name.toString(), ...variables },
        { enabled: testnet ? !!testnet : !testnet }
      )
    );
  });
  return queries;
};

export const getSubgraphQueriesPerChainFn = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  func: (chain: CHAIN_ID) => any,
  fieldName: string
): UseQueryResult<any, any>[] => {
  const queries: UseQueryResult<any, any>[] = [];
  endpoints.forEach((endpoint) => {
    const variables = {
      queryKey: endpoint.url + "--" + query.name.toString(),
    };
    // @ts-ignore
    variables[fieldName] = func(endpoint.chain);

    queries.push(
      query({ endpoint: endpoint.url }, variables, {
        enabled: testnet ? !!testnet : !testnet,
      })
    );
  });
  return queries;
};
