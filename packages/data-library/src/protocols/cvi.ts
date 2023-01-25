import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "CVI", // Your display name, formatted just how you like it
  description: "CVI is Crypto Volatility Index, the VIX for Crypto. GOVI is the governance token of CVI.", // A short protocol description
  logoUrl: "https://assets.coingecko.com/coins/images/13875/large/GOVI.png?1612451531",
  links: {
    // Links to landing page, socials and docs
    governanceVote: "https://vote.cvi.finance/", // A governance proposal related to bonds
    homepage: "https://cvi.finance/",
    twitter: "https://twitter.com/official_cvi",
    github: "https://github.com/govi-dao",
    medium: "https://cviofficial.medium.com",
    discord: "https://discord.gg/UTZbRtxc",
    telegram: "https://t.me/cviofficial",
    staking: "https://cvi.finance/staking",
  },
  /*
    The address that should be allowed to spend your payout tokens
    and you'll deploy the market from like a multisig or other contract, or a wallet
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0x223013bD8b4569628D50eE106cCbA93189A02aDa"],
  },
  // Tokens specific to your protocol like your governance token or LPs
  // If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the tokens directory
  tokens: [
    {
      // why use many word wen example do trick
      name: "GOVI",
      symbol: "GOVI",
      logoUrl: "https://assets.coingecko.com/coins/images/13875/small/GOVI.png?1612451531",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x07e49d5de43dda6162fa28d24d5935c151875283",
      },
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://www.sushi.com/swap?token0=0x07e49d5de43dda6162fa28d24d5935c151875283&token1=0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8&chainId=42161" }, // Where to acquire your token
      priceSources: [
        // Check out our docs for supported price sources and their usage
        { source: "coingecko", apiId: "govi" }, // Lower number, higher priority
      ],
    },
    {
      name: "Theta CVOL LP",
      symbol: "T-CVOL-LP",
      logoUrl: "https://assets.coingecko.com/coins/images/13875/small/GOVI.png?1612451531",
      priceSources: [
        {
          source: "custom",
          customPriceFunction: CUSTOM_PRICE_FEEDS.CVOL,
          providerChainId: CHAIN_ID.ARBITRUM_MAINNET,
        },
      ],
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://cvi.finance/vaults/cvol" },
      addresses: { [CHAIN_ID.ARBITRUM_MAINNET]: "0xFDeB59a2B4891ea17610EE38665249acC9FCC506" },
    },
  ],
} as ProtocolDefinition;
