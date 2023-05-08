import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Shib Original Vision", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description: "Shib Original Vision ($SOV) fixes the corruption behind $SHIB by fairly distributing $SOV to those who believe in the genuine Shiba Inu community. $SOV was developed by true devotees in the dream that was once Shiba. They intend for $SOV to be distributed in a manner that is equitable, righteous, and transparent.", // A short protocol description
  logoUrl: "https://assets.coingecko.com/coins/images/29601/small/photo_2023-03-19_19-07-40_2.png",
  // Links to landing page, socials and docs
  links: {
    // NOTE: bonding is inscribed on the whitepaper prior to TGE.
    governanceVote: "", // A governance proposal related to bonds
    homepage: "https://www.shiboriginalvision.com/",
    twitter: "https://twitter.com/ShibSOV",
    github: "",
    medium: "https://medium.com/@shiboriginalvision",
    discord: "https://discord.com/invite/rmbTWHF5JW",
    telegram: "https://t.me/ShibOriginalVision",
    everipedia: "",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: ["0xa40FD6903F7bd9a3590A84861ccD5b600d3a5121"],
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "ShibOriginalVision",
      symbol: "SOV",
      logoUrl: "https://assets.coingecko.com/coins/images/29601/small/photo_2023-03-19_19-07-40_2.png",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "0x2C5BC2Ba3614fD27FCc7022eA71d9172E2632c16",
      },
      purchaseLinks: { [CHAIN_ID.ETHEREUM_MAINNET]: "https://app.uniswap.org/#/swap" }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "shib-original-vision" },
        /*
          If you need to add a custom price function please add it in ../custom-price-feeds.ts
          then uncomment the following line and refer to it using the name you set in the
          CUSTOM_PRICE_FEEDS enum
        */
        // { source: "custom", customPriceFunction: CUSTOM_PRICE_FEEDS.US_STABLE },
      ],
    },
  ],
} as ProtocolDefinition;
