import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Lodestar", // Your display name, formatted just how you like it
  description: "Lodestar Finance is an algorithmic borrowing and lending protocol that aims to bring the critical DeFi primitive of decentralized money markets to Arbitrum communities. ", // A short protocol description
  logoUrl: "https://assets.coingecko.com/coins/images/28218/large/lode.png?1668429341",
  links: {
    // Links to landing page, socials and docs
    governanceVote: "https://medium.com/@appo.lodestar/lodestar-finance-community-fundraising-4754c33a91ad", // A governance proposal related to bonds
    homepage: "https://lodestarfinance.io",
    twitter: "https://twitter.com/LodestarFinance",
    github: "https://github.com/Lodestar-Finance",
    medium: "https://medium.com/@appo.lodestar/",
    discord: "https://discord.com/invite/UJDVFxKWx4",
    telegram: "https://t.me/lodestarfinancearb",
    staking: "",
  },
  /*
    The address that should be allowed to spend your payout tokens
    and you'll deploy the market from like a multisig or other contract, or a wallet
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0xed093F9720B2507C9B54FC117ecB2618910734dd"],
  },
  // Tokens specific to your protocol like your governance token or LPs
  // If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the tokens directory
  tokens: [
    {
      // why use many word wen example do trick
      name: "Lodestar",
      symbol: "LODE",
      logoUrl: "https://assets.coingecko.com/coins/images/28218/small/lode.png?1668429341",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0xF19547f9ED24aA66b03c3a552D181Ae334FBb8DB",
      },
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.camelot.exchange/?token1=0x82aF49447D8a07e3bd95BD0d56f35241523fBab1&token2=0xF19547f9ED24aA66b03c3a552D181Ae334FBb8DB" }, // Where to acquire your token
      priceSources: [
        // Check out our docs for supported price sources and their usage
        { source: "coingecko", apiId: "lodestar" }, // Lower number, higher priority
      ],
    },
  ],
} as ProtocolDefinition;
