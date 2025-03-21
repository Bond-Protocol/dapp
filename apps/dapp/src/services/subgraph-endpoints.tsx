import { UseQueryResult, useQueries } from "@tanstack/react-query";
import { environment } from "src/environment";
import { mainnetSubgraphs, testnetSubgraphs } from "src/config";
import { CHAIN_ID } from "types";
import { Variables } from "graphql-request";
import { queryAllEndpoints } from "src/utils/queryAllEndpoints";

/**List of available subgraph endpoint urls indexed by chain*/
export const subgraphEndpoints = {
  ...mainnetSubgraphs,
  ...testnetSubgraphs,
} as Record<number, string>;

export const mainnetEndpoints = [
  {
    url: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET],
    chain: CHAIN_ID.ETHEREUM_MAINNET,
  },
  {
    url: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET],
    chain: CHAIN_ID.ARBITRUM_MAINNET,
  },
  {
    url: subgraphEndpoints[CHAIN_ID.OPTIMISM_MAINNET],
    chain: CHAIN_ID.OPTIMISM_MAINNET,
  },
  {
    url: subgraphEndpoints[CHAIN_ID.POLYGON_MAINNET],
    chain: CHAIN_ID.POLYGON_MAINNET,
  },
  {
    url: subgraphEndpoints[CHAIN_ID.BASE_MAINNET],
    chain: CHAIN_ID.BASE_MAINNET,
  },
];

export const testnetEndpoints = [
  // {
  //   url: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET],
  //   chain: CHAIN_ID.GOERLI_TESTNET,
  // },
  // {
  //   url: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET],
  //   chain: CHAIN_ID.ARBITRUM_GOERLI_TESTNET,
  // },
  // {
  //   url: subgraphEndpoints[CHAIN_ID.OPTIMISM_GOERLI_TESTNET],
  //   chain: CHAIN_ID.OPTIMISM_GOERLI_TESTNET,
  // },

  // {
  //   url: subgraphEndpoints[CHAIN_ID.POLYGON_MUMBAI_TESTNET],
  //   chain: CHAIN_ID.POLYGON_MUMBAI_TESTNET,
  // },
  {
    url: subgraphEndpoints[CHAIN_ID.BASE_SEPOLIA],
    chain: CHAIN_ID.BASE_SEPOLIA,
  },
  /*{
    url: subgraphEndpoints[CHAIN_ID.AVALANCHE_FUJI_TESTNET],
    chain: CHAIN_ID.AVALANCHE_FUJI_TESTNET,
  },
   */
];

export const currentEndpoints = environment.isTesting
  ? testnetEndpoints
  : mainnetEndpoints;

export const getSubgraphQuery = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  chain: string,
  enabled: boolean,
  variables?: {}
): UseQueryResult<any, any> => {
  const endpoint = {
    // @ts-ignore
    url: subgraphEndpoints[chain],
    chain: chain,
  };

  return query(
    {
      endpoint: endpoint.url,
      fetchParams: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    },
    { queryKey: endpoint.url + "--" + query.name.toString(), ...variables },
    { enabled: enabled }
  );
};

const isTestnet = environment.isTestnet;

export function useGetSubgraphQueries<TQuery>({
  document,
  variables,
}: {
  document: string;
  variables?: Variables;
}) {
  return useQueries({
    queries: queryAllEndpoints<TQuery>({ document, variables }),
    combine: (responses) => {
      const filteredResponses = responses.filter(
        (response): response is UseQueryResult<TQuery> =>
          response?.data !== undefined
      );
      return {
        queries: filteredResponses,
        isLoading: responses.some((r) => r.isLoading),
      };
    },
  });
}

export const getSubgraphQueriesPerChainFn = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  func: (chain: CHAIN_ID) => any,
  fieldName: string
): UseQueryResult<any, any>[] => {
  const endpoints = isTestnet ? testnetEndpoints : mainnetEndpoints;

  const queries: UseQueryResult<any, any>[] = [];
  endpoints.forEach((endpoint) => {
    const variables = {
      queryKey: endpoint.url + "--" + query.name.toString(),
    };
    // @ts-ignore
    variables[fieldName] = func(endpoint.chain);

    queries.push(
      query(
        {
          endpoint: endpoint.url,
          fetchParams: {
            headers: {
              "Content-Type": "application/json",
            },
          },
        },
        variables,
        { enabled: isTestnet ? !!isTestnet : !isTestnet }
      )
    );
  });
  return queries;
};
