import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Camelot DEX", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description: "Camelot is an ecosystem-focused and community-driven DEX built on Arbitrum.", // A short protocol description
  logoUrl: "https://app.camelot.exchange/images/logo-sm.svg",
  // Links to landing page, socials and docs
  links: {
    governanceVote: "", // A governance proposal related to bonds
    homepage: "https://app.camelot.exchange",
    staking: "",
    twitter: "https://twitter.com/CamelotDEX",
    github: "https://github.com/CamelotLabs",
    medium: "https://camelotdex.medium.com/",
    discord: "https://discord.com/invite/camelotdex",
    telegram: "https://t.me/camelotdex",
    everipedia: "",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0x01Bb7B44cc398AaA2b76Ac6253F0F5634279Db9D"],
    [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]: ["0xEb4bc9DfC7B3009b5F48Be8bF7736741721C97e3"]
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "Camelot Token",
      symbol: "GRAIL",
      logoUrl: "https://app.camelot.exchange/images/tokens/grail.svg",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8",
        [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]: "0x0288ED36a911AFE377B51C05cb33f7ABE899a517"
      },
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.camelot.exchange" }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "camelot-token" },
        /*
          If you need to add a custom price function please add it in ../custom-price-feeds.ts
          then uncomment the following line and refer to it using the name you set in the
          CUSTOM_PRICE_FEEDS enum
        */
        // { source: "custom", customPriceFunction: CUSTOM_PRICE_FEEDS.US_STABLE },
      ],
    },
    {
      name: "xGRAIL Token",
      symbol: "xGRAIL",
      logoUrl: "https://app.camelot.exchange/images/tokens/xgrail.svg",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x3CAaE25Ee616f2C8E13C74dA0813402eae3F496b",
        [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]: "0x45bd859A0533d29B4D55a860bd70A332AE810dEE"
      },
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.camelot.exchange" }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "camelot-token" },
        /*
          If you need to add a custom price function please add it in ../custom-price-feeds.ts
          then uncomment the following line and refer to it using the name you set in the
          CUSTOM_PRICE_FEEDS enum
        */
        // { source: "custom", customPriceFunction: CUSTOM_PRICE_FEEDS.US_STABLE },
      ],
    }
  ],
} as ProtocolDefinition;
