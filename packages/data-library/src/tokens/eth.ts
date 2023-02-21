import { CHAIN_ID } from "../constants";

export default {
  name: "Wrapped Ethereum",
  symbol: "WETH",
  logoUrl: "https://storage.fleek.zone/6e41a561-e275-4698-bc36-548d30a80e96-bucket/WETH.png",
  priceSources: [{ source: "coingecko", apiId: "ethereum" }],
  purchaseLinks: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "https://app.uniswap.org/#/swap",
    [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.uniswap.org/#/tokens/arbitrum/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    [CHAIN_ID.GOERLI_TESTNET]:
      "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6&chainId=5",
  },
  addresses: {
    eth: "",
    [CHAIN_ID.ETHEREUM_MAINNET]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    [CHAIN_ID.ARBITRUM_MAINNET]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    [CHAIN_ID.POLYGON_MAINNET]: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    [CHAIN_ID.BSC_MAINNET]: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    [CHAIN_ID.OPTIMISM_MAINNET]: "0x4200000000000000000000000000000000000006",
    [CHAIN_ID.AVALANCHE_MAINNET]: "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
    [CHAIN_ID.FANTOM_MAINNET]: "0x74b23882a30290451a17c44f4f05243b6b58c76d",
    [CHAIN_ID.GOERLI_TESTNET]: [
      "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
      "0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1",
    ],
    [CHAIN_ID.OPTIMISM_GOERLI_TESTNET]: "0x4200000000000000000000000000000000000006",
  },
};
