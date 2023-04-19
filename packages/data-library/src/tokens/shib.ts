import { CUSTOM_PRICE_FEEDS, CHAIN_ID } from "../constants";

export default {
  name: "SHIBA INU",
  symbol: "SHIB",
  logoUrl: "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
  priceSources: [{ source: "coingecko", apiId: "shiba-inu" }],
  addresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  },
  purchaseLinks: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "https://app.uniswap.org/#/swap",
  },
};
