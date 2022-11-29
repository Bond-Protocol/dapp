import { CHAIN_ID } from "@bond-protocol/bond-library";

/**List of available subgraph endpoint urls indexed by chain*/
export const subgraphEndpoints = {
  [CHAIN_ID.ETHEREUM_MAINNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-mainnet",
  [CHAIN_ID.GOERLI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-goerli",
  [CHAIN_ID.ARBITRUM_MAINNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-arbitrum",
  [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]:
    "https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-goerli-arbitrum",
};

export const getSubgraphEndpoints = (): string[] => {
  return [
    subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET],
    subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET],
    subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET],
    subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET]
  ];
};
