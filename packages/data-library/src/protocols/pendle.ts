import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Pendle", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description: "Pendle is a yield-trading protocol, enabling you to purchase asset at a discount or long DeFi yield.", // A short protocol description
  logoUrl: "https://docs.pendle.finance/img/logo.svg",
  // Links to landing page, socials and docs
  links: {
    governanceVote: "", // A governance proposal related to bonds
    homepage: "https://pendle.finance/",
    staking: "",
    twitter: "https://twitter.com/pendle_fi",
    github: "https://github.com/pendle-finance",
    medium: "https://medium.com/pendle",
    discord: "https://pendle.finance/discord",
    telegram: "https://t.me/pendlefinance",
    everipedia: "",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0x7877AdFaDEd756f3248a0EBfe8Ac2E2eF87b75Ac"]
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "Pendle Token",
      symbol: "PENDLE",
      logoUrl: "https://docs.pendle.finance/img/TokenLogo.svg",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "0x808507121B80c02388fAd14726482e061B8da827",
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8"
      },
      purchaseLinks: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "https://kyberswap.com/swap/ethereum",
        [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.camelot.exchange"
      }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "pendle" },
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
