import { CUSTOM_PRICE_FEEDS, CHAIN_ID } from "../constants";
export default {
  name: "Tether USD",
  symbol: "USDT",
  logoUrl: "https://storageapi.fleek.co/fc635ae1-c8aa-4181-b7db-801a533b8fa9-bucket/USDT.png",
  priceSources: [{ source: "coingecko", apiId: "tether" }],
  purchaseLinks: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "https://curve.fi/",
    [CHAIN_ID.ARBITRUM_MAINNET]: "https://saddle.exchange/#/",
    [CHAIN_ID.GOERLI_TESTNET]: "https://app.compound.finance/",
  },
  addresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    [CHAIN_ID.ARBITRUM_MAINNET]: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    [CHAIN_ID.POLYGON_MAINNET]: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    [CHAIN_ID.BSC_MAINNET]: "0x55d398326f99059ff775485246999027b3197955",
    [CHAIN_ID.OPTIMISM_MAINNET]: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    [CHAIN_ID.AVALANCHE_MAINNET]: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
    [CHAIN_ID.FANTOM_MAINNET]: "0x049d68029688eabf473097a2fc38ef61633a3c7a",
    [CHAIN_ID.GOERLI_TESTNET]: "0x79C950C7446B234a6Ad53B908fBF342b01c4d446",
  },
};
