import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Neutra Finance", // Your display name, formatted just how you like it
  description: "Neutra Finance is a yield protocol focusing on delta neutral vaults", // A short protocol description
  logoUrl: "https://assets.coingecko.com/coins/images/28813/small/NEU_Token_logo.png?1674455093",
  links: {
    // Links to landing page, socials and docs
    governanceVote: "", // A governance proposal related to bonds
    homepage: "https://neutra.finance",
    twitter: "https://twitter.com/Neutrafinance",
    github: "https://github.com/NeutraFinance/neutra-gmx-contracts",
    medium: "https://medium.com/@neutrafinance",
    discord: "discord.gg/h5GxDEAxyY",
    telegram: "https://t.me/NeutraFi",
    staking: "",
  },
  /*
    The address that should be allowed to spend your payout tokens
    and you'll deploy the market from like a multisig or other contract, or a wallet
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0xfba3b455211a3a09689788Ac3A14B4F8Baf012B4"],
  },
  // Tokens specific to your protocol like your governance token or LPs
  // If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the tokens directory
  tokens: [
    {
      // why use many word wen example do trick
      name: "Neutra Token",
      symbol: "NEU",
      logoUrl: "https://assets.coingecko.com/coins/images/28813/small/NEU_Token_logo.png?1674455093",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0xdA51015b73cE11F77A115Bb1b8a7049e02dDEcf0",
      },
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.camelot.exchange" }, // Where to acquire your token
      priceSources: [
        // Check out our docs for supported price sources and their usage
        { source: "coingecko", apiId: "neutra-finance" }, // Lower number, higher priority
      ],
    },
  ],
} as ProtocolDefinition;