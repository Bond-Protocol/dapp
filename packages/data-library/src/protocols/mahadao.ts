import { CHAIN_ID, SUPPORTED_LP_TYPES } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "MahaDAO", // Your display name, formatted just how you like it
  description:
    "MahaDAO is a blockchain-based, community governed investment platform and decentralized venture capital fund.", // A short protocol description
  logoUrl: "https://assets.coingecko.com/coins/images/13404/small/MAHA_Token.png?1625651604",
  links: {
    // Links to landing page, socials and docs
    governanceVote: "https://gov.mahadao.com", // A governance proposal related to bonds
    homepage: "https://mahadao.com",
    twitter: "https://twitter.com/themahadao",
    github: "https://github.com/mahadao",
    discord: "https://discord.gg/mahadao",
    telegram: "https://t.me/mahadao",
    staking: "https://gov.mahadao.com",
  },
  /*
    The address that should be allowed to spend your payout tokens
    and you'll deploy the market from like a multisig or other contract, or a wallet
  */
  issuerAddresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: [
      "0x77cd66d59ac48a0E7CE54fF16D9235a5fffF335E",
      "0x6357EDbfE5aDA570005ceB8FAd3139eF5A8863CC",
    ],
  },
  // Tokens specific to your protocol like your governance token or LPs
  // If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the tokens directory
  tokens: [
    {
      // why use many word wen example do trick
      name: "MahaDAO",
      symbol: "MAHA",
      logoUrl: "https://assets.coingecko.com/coins/images/13404/small/MAHA_Token.png?1625651604",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "0x745407c86df8db893011912d3ab28e68b62e49b0",
      },
      purchaseLinks: {
        [CHAIN_ID.ETHEREUM_MAINNET]:
          "https://app.uniswap.org/#/swap?outputCurrency=0x745407c86df8db893011912d3ab28e68b62e49b0",
      }, // Where to acquire your token
      priceSources: [
        // Check out our docs for supported price sources and their usage
        { source: "coingecko", apiId: "mahadao" }, // Lower number, higher priority
      ],
    },
    {
      name: "MAHA/ETH UniV2 LP",
      symbol: "MAHA-ETH-LP",
      lpType: SUPPORTED_LP_TYPES.UNISWAP_V2,
      addresses: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "0x86bb7e572fe959d5fe864681760c2a15ee14ce95",
      },
      token0Address: "0x745407c86DF8DB893011912d3aB28e68B62E49B0",
      token1Address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      purchaseLinks: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "https://app.uniswap.org/#/add/v2/0x745407c86DF8DB893011912d3aB28e68B62E49B0/ETH",
      },
      priceSources: [],
    },
  ],
} as ProtocolDefinition;
