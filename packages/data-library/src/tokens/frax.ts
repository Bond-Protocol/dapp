import { CUSTOM_PRICE_FEEDS, CHAIN_ID } from "../constants";
export default {
  name: "FRAX",
  symbol: "FRAX",
  logoUrl: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/FRAX.png",
  priceSources: [{ source: "coingecko", apiId: "frax" }],
  purchaseLinks: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "https://curve.fi/",
    [CHAIN_ID.ARBITRUM_MAINNET]: "https://saddle.exchange/#/",
  },
  addresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: "0x853d955acef822db058eb8505911ed77f175b99e",
    [CHAIN_ID.ARBITRUM_MAINNET]: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
    [CHAIN_ID.POLYGON_MAINNET]: "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89",
    [CHAIN_ID.BSC_MAINNET]: "0x90c97f71e18723b0cf0dfa30ee176ab653e89f40",
    [CHAIN_ID.OPTIMISM_MAINNET]: "0x2e3d870790dc77a83dd1d18184acc7439a53f475",
    [CHAIN_ID.AVALANCHE_MAINNET]: "0xd24c2ad096400b6fbcd2ad8b24e7acbc21a1da64",
    [CHAIN_ID.FANTOM_MAINNET]: "0xdc301622e621166bd8e82f2ca0a26c13ad0be355",
    [CHAIN_ID.GOERLI_TESTNET]: "0x73651AD693531F9937528009cC204a4d9b696a68",
  },
};
