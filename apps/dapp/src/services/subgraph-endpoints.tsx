import { UseQueryResult } from "react-query";
import { environment } from "src/environment";
import { CHAIN_ID } from "@bond-protocol/types";

/**List of available subgraph endpoint urls indexed by chain*/
export const subgraphEndpoints = {
  [CHAIN_ID.ETHEREUM_MAINNET]: `${
    import.meta.env.VITE_ETHEREUM_MAINNET_SUBGRAPH_ENDPOINT
  }`,
  [CHAIN_ID.GOERLI_TESTNET]: `${
    import.meta.env.VITE_ETHEREUM_TESTNET_SUBGRAPH_ENDPOINT
  }`,
  [CHAIN_ID.ARBITRUM_MAINNET]: `${
    import.meta.env.VITE_ARBITRUM_MAINNET_SUBGRAPH_ENDPOINT
  }`,
  [CHAIN_ID.OPTIMISM_MAINNET]: `${
    import.meta.env.VITE_OPTIMISM_MAINNET_SUBGRAPH_ENDPOINT
  }`,
  [CHAIN_ID.POLYGON_MAINNET]: `${
    import.meta.env.VITE_POLYGON_MAINNET_SUBGRAPH_ENDPOINT
  }`,
  [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]: `${
    import.meta.env.VITE_ARBITRUM_TESTNET_SUBGRAPH_ENDPOINT
  }`,
  [CHAIN_ID.OPTIMISM_GOERLI_TESTNET]: `${
    import.meta.env.VITE_OPTIMISM_TESTNET_SUBGRAPH_ENDPOINT
  }`,
  [CHAIN_ID.POLYGON_MUMBAI_TESTNET]: `${
    import.meta.env.VITE_POLYGON_TESTNET_SUBGRAPH_ENDPOINT
  }`,
  [CHAIN_ID.AVALANCHE_FUJI_TESTNET]: `${
    import.meta.env.VITE_AVALANCHE_TESTNET_SUBGRAPH_ENDPOINT
  }`,
};

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
];

export const testnetEndpoints = [
  {
    url: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET],
    chain: CHAIN_ID.GOERLI_TESTNET,
  },
  {
    url: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET],
    chain: CHAIN_ID.ARBITRUM_GOERLI_TESTNET,
  },
  {
    url: subgraphEndpoints[CHAIN_ID.OPTIMISM_GOERLI_TESTNET],
    chain: CHAIN_ID.OPTIMISM_GOERLI_TESTNET,
  },

  {
    url: subgraphEndpoints[CHAIN_ID.POLYGON_MUMBAI_TESTNET],
    chain: CHAIN_ID.POLYGON_MUMBAI_TESTNET,
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

export const getSubgraphQueries = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  variables?: {}
): UseQueryResult<any, any>[] => {
  const endpoints = isTestnet ? testnetEndpoints : mainnetEndpoints;

  const queries: UseQueryResult<any, any>[] = [];
  endpoints.forEach((endpoint) => {
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
        { queryKey: endpoint.url + "--" + query.name.toString(), ...variables },
        { enabled: isTestnet ? !!isTestnet : !isTestnet }
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
