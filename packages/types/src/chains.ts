export enum CHAIN_ID {
  ETHEREUM_MAINNET = "1",
  GOERLI_TESTNET = "5",
  POA_CORE = "99",
  POA_SOKOL = "77",
  GNOSIS_MAINNET = "100",
  POLYGON_MAINNET = "137",
  POLYGON_MUMBAI_TESTNET = "80001",
  FANTOM_MAINNET = "250",
  BSC_MAINNET = "56",
  AVALANCHE_MAINNET = "43114",
  AVALANCHE_FUJI_TESTNET = "43113",
  CELO_MAINNET = "42220",
  CELO_ALFAJORES_TESTNET = "44787",
  FUSE_MAINNET = "122",
  MOONRIVER_MAINNET = "1285",
  ARBITRUM_MAINNET = "42161",
  ARBITRUM_GOERLI_TESTNET = "421613",
  OPTIMISM_MAINNET = "10",
  OPTIMISM_GOERLI_TESTNET = "420",
  AURORA_MAINNET = "1313161554",
  AURORA_TESTNET = "1313161555",
  BOBA_MAINNET = "288",
  HARMONY_MAINNET = "1666600000",
}

export const chainLogos: Record<number, string> = {
  1: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ETHEREUM.png",
  5: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ETHEREUM.png",
  10: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/OPTIMISM.png",
  56: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/BSC.png",
  137: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/POLYGON.png",
  250: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/FANTOM.png",
  420: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/OPTIMISM.png",
  42161:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  43113:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/AVALANCHE.png",
  43114:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/AVALANCHE.png",
  80001:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/POLYGON.png",
  421613:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  8453: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMDA1MkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0xNCAyOGExNCAxNCAwIDEgMCAwLTI4IDE0IDE0IDAgMCAwIDAgMjhaIi8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEzLjk2NyAyMy44NmM1LjQ0NSAwIDkuODYtNC40MTUgOS44Ni05Ljg2IDAtNS40NDUtNC40MTUtOS44Ni05Ljg2LTkuODYtNS4xNjYgMC05LjQwMyAzLjk3NC05LjgyNSA5LjAzaDE0LjYzdjEuNjQySDQuMTQyYy40MTMgNS4wNjUgNC42NTQgOS4wNDcgOS44MjYgOS4wNDdaIi8+PC9nPjwvc3ZnPg==",
  84532:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMDA1MkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0xNCAyOGExNCAxNCAwIDEgMCAwLTI4IDE0IDE0IDAgMCAwIDAgMjhaIi8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEzLjk2NyAyMy44NmM1LjQ0NSAwIDkuODYtNC40MTUgOS44Ni05Ljg2IDAtNS40NDUtNC40MTUtOS44Ni05Ljg2LTkuODYtNS4xNjYgMC05LjQwMyAzLjk3NC05LjgyNSA5LjAzaDE0LjYzdjEuNjQySDQuMTQyYy40MTMgNS4wNjUgNC42NTQgOS4wNDcgOS44MjYgOS4wNDdaIi8+PC9nPjwvc3ZnPg==",
};
