import { CUSTOM_PRICE_FEEDS, CHAIN_ID } from "../constants";
export default {
  name: "Sperax USD",
  symbol: "USDs",
  logoUrl: "https://assets.coingecko.com/coins/images/21973/large/USDs_logo_1000X1000.png?1640565887",
  priceSources: [{ source: "coingecko", apiId: "sperax-usd" }],
  purchaseLinks: {
    [CHAIN_ID.ARBITRUM_MAINNET]: "https://saddle.exchange/#/",
  },
  addresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: "0xd74f5255d557944cf7dd0e45ff521520002d5748",
  },
};
