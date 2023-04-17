import { CHAIN_ID, SUPPORTED_LP_TYPES } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "MVD", // Your display name, formatted just how you like it
  description:
    "Metavault DAO is a blockchain-based, community governed investment platform and decentralized venture capital fund.", // A short protocol description
  logoUrl: "https://assets.coingecko.com/coins/images/23899/small/MVD_Coin-simple.png?1681090496",
  links: {
    // Links to landing page, socials and docs
    governanceVote: "https://vote.metavault.org", // A governance proposal related to bonds
    homepage: "https://metavault.org",
    twitter: "https://twitter.com/metavaultdao",
    github: "https://github.com/metavaultorg",
    medium: "https://metavault.medium.com/",
    discord: "https://discord.com/invite/metavault",
    telegram: "https://t.me/MetavaultTrade",
    staking: "https://app.metavault.org/#/dividends",
  },
  /*
    The address that should be allowed to spend your payout tokens
    and you'll deploy the market from like a multisig or other contract, or a wallet
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0xc1048DB8e91E68b468b1d7B513fbB666C6e1622D"],
  },
  // Tokens specific to your protocol like your governance token or LPs
  // If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the tokens directory
  tokens: [
    {
      // why use many word wen example do trick
      name: "MVD",
      symbol: "MVD",
      logoUrl: "https://assets.coingecko.com/coins/images/23899/small/MVD_Coin-simple.png?1681090496",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x15a808ed3846D25e88AE868DE79F1bcB1Ac382B5",
      },
      purchaseLinks: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.camelot.exchange/?token2=0x15a808ed3846d25e88ae868de79f1bcb1ac382b5",
      }, // Where to acquire your token
      priceSources: [
        // Check out our docs for supported price sources and their usage
        { source: "coingecko", apiId: "metavault-dao" }, // Lower number, higher priority
      ],
    },
    {
      name: "Metavault Ethereum LP",
      symbol: "MVD-ETH-LP",
      lpType: SUPPORTED_LP_TYPES.UNISWAP_V2,
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x682BD6921B8b9634EB4635a269EA8Ae857d6Bb4e",
      },
      token0Address: "0x15a808ed3846d25e88ae868de79f1bcb1ac382b5",
      token1Address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      purchaseLinks: {
        [CHAIN_ID.ARBITRUM_MAINNET]:
          "https://app.camelot.exchange/liquidity?token1=0x15a808ed3846D25e88AE868DE79F1bcB1Ac382B5&token2=0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      },
      priceSources: [],
    },
  ],
} as ProtocolDefinition;
