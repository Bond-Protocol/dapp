import { CHAIN_ID, CUSTOM_PRICE_FEEDS, SUPPORTED_LP_TYPES } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Dex Finance", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description:
    "Dex Finance provides an ecosystem of financial products that aims to help users navigate through the intricacies DeFi via sustainable real yields.", // A short protocol description
  logoUrl:
    "https://dexfinance-fullapp-develop-3breg.ondigitalocean.app/static/media/logo.ed7f76eb9ae23fe7a1141d23e97aba44.svg",
  // Links to landing page, socials and docs
  links: {
    // NOTE: bonding is inscribed on the whitepaper prior to TGE.
    governanceVote: "", // A governance proposal related to bonds
    homepage: "https://dexfinance.com/",
    twitter: "https://twitter.com/DexFinance",
    github: "",
    medium: "https://medium.com/@DexFinance",
    discord: "https://discord.com/invite/DexFinance",
    telegram: "https://t.me/dexfinance",
    everipedia: "",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0xEca93E266B914700a26CF3fE364fAd4134f8Ba94"],
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "DexFi Governance",
      symbol: "gDEX",
      logoUrl:
        "https://www.dexfinance.com/wp-content/uploads/2022/10/Dex-Finance-Icon.svg",
      priceSources: [
        {
          source: "custom",
          customPriceFunction: CUSTOM_PRICE_FEEDS.DEXFI_GDEX,
          providerChainId: CHAIN_ID.ARBITRUM_MAINNET,
        },
      ],
      purchaseLinks: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.dexfinance.com/swap",
      }, // Where to acquire your token
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]:
          "0xda064d44871bA31Dae33A65B3E23B37E44E9168A",
      },
    },
    {
      name: "USDEX+",
      symbol: "USDEX+",
      logoUrl:
        "https://dexfinance-fullapp-develop-3breg.ondigitalocean.app/static/media/USDEX+.65ec4876ac2d3bea6b747406142e90a9.svg",
      priceSources: [
        {
          source: "custom",
          customPriceFunction: CUSTOM_PRICE_FEEDS.DEXFI_USDEX,
          providerChainId: CHAIN_ID.ARBITRUM_MAINNET,
        },
      ],
      purchaseLinks: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.dexfinance.com/swap",
      }, // Where to acquire your token
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]:
          "0x2c093F7d7Db41057A2ddD3cB1AD8b4E9C3dFfBec",
      },
    },
    {
      name: "USDEX+/gDEX LP",
      symbol: "USDEX+/gDEX-LP",
      // @ts-ignore
      lpType: SUPPORTED_LP_TYPES.UNISWAP_V2,
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]:
          "0x62118a631D030C3023dD3001b7ce96aa042ffb1E",
      },
      token0Address: "0x2c093F7d7Db41057A2ddD3cB1AD8b4E9C3dFfBec",
      token1Address: "0xda064d44871bA31Dae33A65B3E23B37E44E9168A",
      purchaseLinks: {
        [CHAIN_ID.ARBITRUM_MAINNET]:
          "https://app.dexfinance.com/add/0xda064d44871bA31Dae33A65B3E23B37E44E9168A/0x2c093F7d7Db41057A2ddD3cB1AD8b4E9C3dFfBec",
      },
      priceSources: [],
    },
  ],
} as ProtocolDefinition;
