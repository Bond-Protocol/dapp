import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "LSDx", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description: "An ultra-liquid protocol for all LSD.", // A short protocol description
  logoUrl: "https://pbs.twimg.com/profile_images/1631562250933899265/KPaZC0_e_normal.jpg",
  // Links to landing page, socials and docs
  links: {
    governanceVote: "", // A governance proposal related to bonds
    homepage: "https://lsdx.finance/",
    staking: "https://www.lsdx.finance/farm",
    twitter: "https://twitter.com/LSDxfinance",
    medium: "https://medium.com/@LSDxfinance",
    discord: "https://discord.com/invite/GnXWfsz8Dm",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: ["0xd2db549fF9933953c8A884cCC761700dEff689c2"],
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "LSD Coin",
      symbol: "LSD",
      logoUrl: "https://assets.coingecko.com/coins/images/29519/small/logo.png?1679448801",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "0xfAC77A24E52B463bA9857d6b758ba41aE20e31FF",
      },
      purchaseLinks: { [CHAIN_ID.ETHEREUM_MAINNET]: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xfAC77A24E52B463bA9857d6b758ba41aE20e31FF" }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "lsdx-finance" },
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
