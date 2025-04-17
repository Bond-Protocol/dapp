export enum CHAIN_ID {
  ETHEREUM_MAINNET = "1",
  POLYGON_MAINNET = "137",
  POLYGON_MUMBAI_TESTNET = "80001",
  BSC_MAINNET = "56",
  AVALANCHE_MAINNET = "43114",
  AVALANCHE_FUJI_TESTNET = "43113",
  ARBITRUM_MAINNET = "42161",
  ARBITRUM_GOERLI_TESTNET = "421613",
  OPTIMISM_MAINNET = "10",
  OPTIMISM_GOERLI_TESTNET = "420",
  BASE_MAINNET = "8453",
  BASE_SEPOLIA = "84532",
  MODE_MAINNET = "34443",
  BERA_BARTIO = "80084",
  SONIC = "146",
}

export const chainLogos: Record<number, string> = {
  1: "/chains/ethereum.png",
  10: "/chains/optimism.png",
  56: "/chains/bsc.png",
  137: "/chains/polygon.png",
  146: "/chains/sonic.png",
  420: "/chains/optimism.png",
  42161: "/chains/arbitrum.png",
  80001: "/chains/polygon.png",
  421613: "/chains/arbitrum.png",
  8453: "/chains/base.png",
  84532: "/chains/base.png",
  34443:
    "https://raw.githubusercontent.com/mode-network/brandkit/main/Assets/Logo/Token.svg",
  80084:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/berachain-logo.png",
};
