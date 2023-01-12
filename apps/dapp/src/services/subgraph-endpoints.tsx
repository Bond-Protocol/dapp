import { CHAIN_ID } from "@bond-protocol/bond-library";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { UseQueryResult } from "react-query";

/**List of available subgraph endpoint urls indexed by chain*/
export const subgraphEndpoints = {
  [CHAIN_ID.ETHEREUM_MAINNET]:
    "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-ethereum-testing",
  [CHAIN_ID.GOERLI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-goerli",
  [CHAIN_ID.ARBITRUM_MAINNET]:
    "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-arbitrum-testing",
  [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-goerli-arbitrum",
  [CHAIN_ID.OPTIMISM_GOERLI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-optimism-goerli",
};

export const mainnetEndpoints = [
  {
    url: "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-ethereum-testing",
    chain: CHAIN_ID.ETHEREUM_MAINNET,
  },
  {
    url: "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-arbitrum-testing",
    chain: CHAIN_ID.ARBITRUM_MAINNET,
  },
  /**
   * This is a hacky fix - mainnetEndpoints and testnetEndpoints arrays need to be the same
   * length or React complains we are breaking the Rules of Hooks.
   *
   * So adding a duplicate entry for one of the existing chains here to balance the numbers out.
   *
   * Not ideal but can come back and look at improvements later.
   */
  {
    url: "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-ethereum-testing",
    chain: CHAIN_ID.ETHEREUM_MAINNET,
  },
  {
    url: "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-ethereum-testing",
    chain: CHAIN_ID.ETHEREUM_MAINNET,
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
    url: "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-polygon-mumbai",
    chain: CHAIN_ID.POLYGON_MUMBAI_TESTNET,
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
      query({ endpoint: endpoint.url }, variables, {
        enabled: testnet ? !!testnet : !testnet,
      })
    );
  });
  return queries;
};
