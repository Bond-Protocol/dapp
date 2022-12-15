import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Sperax", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description:
    "Sperax is an Arbitrum DeFi protocol featuring a yield-aggregator stablecoin, Sperax USD (USDs), and a Uniswap V3 one-click farm launcher, Demeter protocol.", // A short protocol description
  logoUrl: "https://storageapi.fleek.co/fc635ae1-c8aa-4181-b7db-801a533b8fa9-bucket/SPERAX.svg", // svg file
  // Links to landing page, socials and docs
  links: {
    governanceVote: "https://snapshot.org/#/speraxdao.eth", // A governance proposal related to bonds
    homepage: "https://www.sperax.io/",
    USDs: "https://app.sperax.io/",
    demeter: "https://demeter.sperax.io/",
    twitter: "https://twitter.com/SperaxUSD",
    github: "https://github.com/Sperax",
    medium: "https://medium.com/sperax",
    discord: "https://discord.gg/sperax",
    telegram: "https://t.me/SperaxUSD",
    staking: "https://app.sperax.io/stake",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: ["0xfCAF5A381eE3c5C42b8D5cad13cc4200c3353AF6"],
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0x5d2bde1C98d3524A4C2E25C514AB68767775e505"],
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "Sperax",
      symbol: "SPA",
      logoUrl: "https://drive.google.com/drive/folders/1wbmS719X_OdOdg2AzPno4Ow9WAbmgYpu", // svg file
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "0xB4A3B0Faf0Ab53df58001804DdA5Bfc6a3D59008",
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x5575552988A3A80504bBaeB1311674fCFd40aD4B",
      },
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.sperax.io/swap" }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "sperax" },
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
