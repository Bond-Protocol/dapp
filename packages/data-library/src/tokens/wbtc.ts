import { CHAIN_ID } from "../constants";
export default {
  name: "Wrapped Bitcoin",
  symbol: "WBTC",
  logoUrl: "https://storageapi.fleek.co/fc635ae1-c8aa-4181-b7db-801a533b8fa9-bucket/WBTC.png",
  priceSources: [{ source: "coingecko", apiId: "wrapped-bitcoin" }],
  purchaseLinks: { [CHAIN_ID.ETHEREUM_MAINNET]: "https://curve.fi/" },
  addresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    [CHAIN_ID.ARBITRUM_MAINNET]: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
    [CHAIN_ID.POLYGON_MAINNET]: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    [CHAIN_ID.OPTIMISM_MAINNET]: "0x68f180fcce6836688e9084f035309e29bf0a2095",
    [CHAIN_ID.AVALANCHE_MAINNET]: "0x50b7545627a5162f82a992c33b87adc75187b218",
    [CHAIN_ID.FANTOM_MAINNET]: "0x321162cd933e2be498cd2267a90534a804051b11",
  },
};
