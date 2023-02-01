import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Y2K", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description: "Y2K Finance is a suite of structured products designed for exotic peg derivatives.", // A short protocol description
  logoUrl: "https://storage.fleek.zone/6e41a561-e275-4698-bc36-548d30a80e96-bucket/Y2K.jpg",
  // Links to landing page, socials and docs
  links: {
    governanceVote: "https://snapshot.org/#/y2k-finance.eth/proposal/0x85ec42ec3b57b372f907a0a5609cea0c73610632fd6843968d5c04bcafabf0ce", // A governance proposal related to bonds
    homepage: "https://www.y2k.finance/",
    staking: "https://www.y2k.finance/lock",
    twitter: "y2kfinance",
    github: "Y2K-Finance",
    medium: "https://medium.com/@Y2KFinance",
    discord: "https://discord.com/invite/3fqQsvC7C6",
    telegram: "",
    everipedia: "",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0x5c84CF4d91Dc0acDe638363ec804792bB2108258"],
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "Y2K",
      symbol: "Y2K",
      logoUrl: "https://storage.fleek.zone/6e41a561-e275-4698-bc36-548d30a80e96-bucket/Y2K.jpg",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x65c936f008bc34fe819bce9fa5afd9dc2d49977f",
      },
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.balancer.fi/#/arbitrum/trade/0x82af49447d8a07e3bd95bd0d56f35241523fbab1/0x65c936f008bc34fe819bce9fa5afd9dc2d49977f" }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "y2k" },
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
