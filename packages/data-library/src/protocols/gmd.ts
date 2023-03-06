import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "GMD", // Your display name, formatted just how you like it
  description: "GMD is a yield-aggregator and smart vaults", // A short protocol description
  logoUrl: "https://assets.coingecko.com/coins/images/28088/small/IcjYItp2_400x400.jpeg?1667445886",
  links: {
    // Links to landing page, socials and docs
    governanceVote: "", // A governance proposal related to bonds
    homepage: "https://gmdprotocol.com",
    twitter: "https://twitter.com/GMDprotocol",
    github: "https://github.com/saulgoodmandev/gmd",
    medium: "https://medium.com/@gmdprotocol",
    discord: "https://discord.gg/x649QhTYxs",
    telegram: "https://t.me/+ukvWB5zXZChhMTgx",
    staking: "",
  },
  /*
    The address that should be allowed to spend your payout tokens
    and you'll deploy the market from like a multisig or other contract, or a wallet
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0x4bf7a0c21660879fdd051f5ee92cd2936779ec57"],
  },
  // Tokens specific to your protocol like your governance token or LPs
  // If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the tokens directory
  tokens: [
    {
      // why use many word wen example do trick
      name: "esGMD",
      symbol: "esGMD",
      logoUrl: "https://assets.coingecko.com/coins/images/28088/small/IcjYItp2_400x400.jpeg?1667445886",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x49E050dF648E9477c7545fE1779B940f879B787A",
      },
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.gmdprotocol.com/dashboard" }, // Where to acquire your token
      priceSources: [
        // Check out our docs for supported price sources and their usage
        { source: "coingecko", apiId: "gmd-protocol" }, // Lower number, higher priority
      ],
    },
  ],
} as ProtocolDefinition;
