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
};

export const getSubgraphEndpoints = (): string[] => {
  const [testnet, setTestnet] = useAtom(testnetMode);

  if (testnet) {
    return [
      subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET],
      subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET],
    ];
  }

  return [
    "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-arbitrum-testing",
    "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-ethereum-testing",
    // subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET],
  ];
};

export const getSubgraphQueries = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  variables?: {}
): UseQueryResult<any, any>[] => {
  const endpoints = getSubgraphEndpoints();
  const [testnet, setTestnet] = useAtom(testnetMode);

  const queries: UseQueryResult<any, any>[] = [];
  endpoints.forEach((endpoint) => {
    queries.push(
      query(
        { endpoint: endpoint },
        { queryKey: endpoint + "--" + query.name.toString(), ...variables },
        { enabled: testnet ? !!testnet : !testnet }
      )
    );
  });
  return queries;
};

export const getSubgraphEndpoints2 = (): { url: string; chain: CHAIN_ID }[] => {
  const [testnet, setTestnet] = useAtom(testnetMode);

  if (testnet) {
    return [
      {
        url: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET],
        chain: CHAIN_ID.GOERLI_TESTNET,
      },
      {
        url: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET],
        chain: CHAIN_ID.ARBITRUM_GOERLI_TESTNET,
      },
    ];
  }

  return [
    {
      url: "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-arbitrum-testing",
      chain: CHAIN_ID.ARBITRUM_MAINNET,
    },
    {
      url: "https://api.thegraph.com/subgraphs/name/spaceturtleship/bp-ethereum-testing",
      chain: CHAIN_ID.ETHEREUM_MAINNET,
    },
    // subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET],
  ];
};

export const getSubgraphQueriesPerChainFn = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  func: (chain: CHAIN_ID) => any,
  fieldName: string
): UseQueryResult<any, any>[] => {
  const endpoints = getSubgraphEndpoints2();
  const [testnet, setTestnet] = useAtom(testnetMode);

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
