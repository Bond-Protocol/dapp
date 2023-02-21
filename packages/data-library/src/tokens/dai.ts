import { CUSTOM_PRICE_FEEDS, CHAIN_ID } from "../constants";

export default {
  name: "DAI",
  symbol: "DAI",
  logoUrl: "https://storage.fleek.zone/6e41a561-e275-4698-bc36-548d30a80e96-bucket/DAI.png",
  priceSources: [{ source: "coingecko", apiId: "dai" }],
  purchaseLinks: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "https://curve.fi/",
    [CHAIN_ID.GOERLI_TESTNET]: "https://app.compound.finance/",
    [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]: "https://app.compound.finance/",
  },
  addresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "0x6b175474e89094c44da98b954eedeac495271d0f",
    [CHAIN_ID.ARBITRUM_MAINNET]: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    [CHAIN_ID.POLYGON_MAINNET]: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    [CHAIN_ID.BSC_MAINNET]: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
    [CHAIN_ID.OPTIMISM_MAINNET]: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    [CHAIN_ID.AVALANCHE_MAINNET]: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    [CHAIN_ID.FANTOM_MAINNET]: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
    [CHAIN_ID.GOERLI_TESTNET]: [
      "0x2899a03ffdab5c90badc5920b4f53b0884eb13cc",
      "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
    ],
    [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]: "0xcA93c9BFaC39efC5b069066a0970c3036C3029c9",
    [CHAIN_ID.OPTIMISM_GOERLI_TESTNET]: [
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      "0xeac3ec0cc130f4826715187805d1b50e861f2dac",
    ],
    [CHAIN_ID.POLYGON_MUMBAI_TESTNET]: "0x0A516075c186a821DAAc20D77fBB78b2dacCD681",
    [CHAIN_ID.AVALANCHE_FUJI_TESTNET]: "0x69da0a4ace14c0befe906f18881a35670e7568ac",
  },
};
