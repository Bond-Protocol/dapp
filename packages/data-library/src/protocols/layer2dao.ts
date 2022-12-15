import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Layer2DAO", // Layer2DAO display name
  description: "The Layer2DAO is expanding the Layer2 Ethereum ecosystem", // Brief L2DAO summary
  logoUrl: "https://assets.coingecko.com/coins/images/23699/large/Khp7Y4Sn.png?1645081048",

  // Relevant L2DAO Links
  links: {
    governanceVote:
      "https://layer2dao.medium.com/introducing-xl2dao-a-passive-yield-generating-asset-by-layer2dao-dcb7b7b38253",
    homepage: "https://layer2dao.org/#/",
    twitter: "https://twitter.com/TheLayer2DAO",
    github: "https://github.com/TheLayer2DAO",
    medium: "https://medium.com/@layer2dao",
    discord: "https://discord.gg/layer2dao",
    staking: "https://staking.layer2dao.org",
  },
  /*
  The address that should be allowed to spend your payout tokens
  and you'll deploy the market from like a multisig or other contract, or a wallet
*/

  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0x5318f07A3a20A2f8bb0DDf14F1DD58C517a76508"],
  },
  // Tokens specific to your protocol like your governance token or LPs
  // If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the tokens directory
  tokens: [
    {
      // why use many word wen example do trick
      name: "Layer2DAO",
      symbol: "l2dao",
      logoUrl: "https://assets.coingecko.com/coins/images/23699/large/Khp7Y4Sn.png?1645081048",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x2CaB3abfC1670D1a452dF502e216a66883cDf079",
      },
      purchaseLinks: {
        [CHAIN_ID.ARBITRUM_MAINNET]:
          "https://app.uniswap.org/#/tokens/arbitrum/0x2CaB3abfC1670D1a452dF502e216a66883cDf079",
      }, // Where to acquire your token
      priceSources: [
        // Check out our docs for supported price sources and their usage
        { source: "coingecko", apiId: "layer2dao" }, // Lower number, higher priority
      ],
    },
  ],
} as ProtocolDefinition;
