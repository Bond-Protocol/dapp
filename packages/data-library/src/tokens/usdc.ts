import { CUSTOM_PRICE_FEEDS, CHAIN_ID } from "../constants";
export default {
  name: "USD Coin",
  symbol: "USDC",
  logoUrl: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/USDC.png",
  addresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    [CHAIN_ID.ARBITRUM_MAINNET]: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    [CHAIN_ID.POLYGON_MAINNET]: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    [CHAIN_ID.BSC_MAINNET]: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    [CHAIN_ID.OPTIMISM_MAINNET]: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    [CHAIN_ID.AVALANCHE_MAINNET]: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    [CHAIN_ID.FANTOM_MAINNET]: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    [CHAIN_ID.GOERLI_TESTNET]: [
      "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
      "0xe0c9275e44ea80ef17579d33c55136b7da269aeb",
    ],
    [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]:
      "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",

    [CHAIN_ID.OPTIMISM_GOERLI_TESTNET]:
      "0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E",
    [CHAIN_ID.POLYGON_MUMBAI_TESTNET]:
      "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23",
  },
  purchaseLinks: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "https://curve.fi/",
    [CHAIN_ID.ARBITRUM_MAINNET]: "https://saddle.exchange/#/",
    [CHAIN_ID.GOERLI_TESTNET]: "https://app.compound.finance/",
  },
  priceSources: [{ source: "coingecko", apiId: "usd-coin" }],
};
