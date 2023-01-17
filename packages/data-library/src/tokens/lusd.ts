import { CUSTOM_PRICE_FEEDS, CHAIN_ID } from "../constants";
export default {
  name: "Liquity USD",
  symbol: "LUSD",
  logoUrl: "https://storageapi.fleek.co/fc635ae1-c8aa-4181-b7db-801a533b8fa9-bucket/LUSD.png",
  priceSources: [{ source: "coingecko", apiId: "liquity-usd" }],
  purchaseLinks: { [CHAIN_ID.ETHEREUM_MAINNET]: "https://curve.fi/#/ethereum/pools/lusd/swap" },
  addresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
    [CHAIN_ID.POLYGON_MAINNET]: "0x23001f892c0c82b79303edc9b9033cd190bb21c7",
    [CHAIN_ID.OPTIMISM_MAINNET]: "0xc40f949f8a4e094d1b49a23ea9241d289b7b2819",
  },
};
