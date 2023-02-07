import { useMemo } from "react";
import { CHAIN_ID } from "@bond-protocol/bond-library";
import { useQueries, UseQueryResult } from "react-query";
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

// export const useSubgraphQueries = (
//   query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
//   variables?: {}
// ) => {
//   const queries = endpoints.map((endpoint) => ({
//     queryKey: endpoint.url + "--" + query.name.toString(),
//     queryFn: () =>
//       query(
//         { endpoint: endpoint.url },
//         { queryKey: endpoint.url + "--" + query.name.toString(), ...variables },
//         { enabled: testnet ? !!testnet : !testnet }
//       ),
//   }));

//   const results = useQueries(queries);

//   return {
//     results,
//   };
// };

// export const useSubgraphForChain = (
//   query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
//   func: (chain: CHAIN_ID) => any,
//   fieldName: string
// ) => {
//   const queries = endpoints.map((endpoint) => {
//     const variables = {
//       queryKey: endpoint.url + "--" + query.name.toString(),
//     };
//     // @ts-ignore
//     variables[fieldName] = func(endpoint.chain);

//     return {
//       queryKey: endpoint.url + "--" + query.name.toString(),
//       queryFn: () =>
//         query({ endpoint: endpoint.url }, variables, {
//           enabled: testnet ? !!testnet : !testnet,
//         }),
//     };
//   });

//   console.log({ queries });
//   const results = useQueries(queries);

//   console.log({ results });
//   return results;
// };
