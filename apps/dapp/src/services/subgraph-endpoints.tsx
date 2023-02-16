import {CHAIN_ID} from "@bond-protocol/bond-library";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {UseQueryResult} from "react-query";

/**List of available subgraph endpoint urls indexed by chain*/
export const subgraphEndpoints = {
  [CHAIN_ID.ETHEREUM_MAINNET]:
    `${import.meta.env.VITE_ETHEREUM_MAINNET_SUBGRAPH_ENDPOINT}`,
  [CHAIN_ID.GOERLI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-goerli",
  [CHAIN_ID.ARBITRUM_MAINNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-arbitrum-mainnet",
  [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-arbitrum-goerli",
  [CHAIN_ID.OPTIMISM_GOERLI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-optimism-goerli",
  [CHAIN_ID.POLYGON_MUMBAI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-polygon-mumbai",
  [CHAIN_ID.AVALANCHE_FUJI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-avalanche-fuji",
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
  {
    url: subgraphEndpoints[CHAIN_ID.AVALANCHE_FUJI_TESTNET],
    chain: CHAIN_ID.AVALANCHE_FUJI_TESTNET,
  },
];

export const getSubgraphQueries = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  variables?: {}
): UseQueryResult<any, any>[] => {
  const [testnet, setTestnet] = useAtom(testnetMode);
  const endpoints = testnet ? testnetEndpoints : mainnetEndpoints;

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
        {queryKey: endpoint.url + "--" + query.name.toString(), ...variables},
        {enabled: testnet ? !!testnet : !testnet}
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
  const [testnet, setTestnet] = useAtom(testnetMode);
  const endpoints = testnet ? testnetEndpoints : mainnetEndpoints;

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
        {enabled: testnet ? !!testnet : !testnet},
      )
    );
  });
  return queries;
};
