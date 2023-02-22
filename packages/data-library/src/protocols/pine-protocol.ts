import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Pine Protocol", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description: "Pine Protocol is a non-custodial decentralized asset-backed lending protocol that allows borrowers to borrow fungible digital tokens from lenders using non-fungible tokens as collateral. The Pine token is the ecosystem token for the Pine protocol and the PineDAO.", // A short protocol description
  logoUrl: "https://assets.coingecko.com/coins/images/25660/small/Logomark-Colour.png?1676282846",
  // Links to landing page, socials and docs
  links: {
    // NOTE: bonding is inscribed on the whitepaper prior to TGE.
    governanceVote: "https://docs.pine.loans/ecosystem/pine-token#bonding", // A governance proposal related to bonds
    homepage: "https://pine.loans",
    staking: "https://app.pine.loans/staking/",
    twitter: "https://twitter.com/PineProtocol",
    github: "https://github.com/pinedefi",
    medium: "https://medium.com/@pineloans",
    discord: "https://discord.com/invite/pineprotocol",
    telegram: "https://t.me/pineprotocolnews",
    everipedia: "",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: ["0x3061007EEC1898FAC97403e692CDe6299d0b3f90"],
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "Pine Token",
      symbol: "PINE",
      logoUrl: "https://assets.coingecko.com/coins/images/25660/small/Logomark-Colour.png?1676282846",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "0x569424c5ee13884a193773fdc5d1c5f79c443a51",
        [CHAIN_ID.POLYGON_MAINNET]: "0x612d833c0c7a54cdfbe9a4328b6d658020563ec0",
      },
      purchaseLinks: { [CHAIN_ID.ETHEREUM_MAINNET]: "https://app.uniswap.org/#/swap" }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "pine" },
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
