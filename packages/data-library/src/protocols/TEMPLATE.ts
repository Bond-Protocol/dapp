import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../index";

/* Protocol Template */
export default {
  name: "", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description: "", // A short protocol description
  logoUrl: "https://your-dao.defi/your-protocol-logo.png",
  // Links to landing page, socials and docs
  links: {
    governanceVote: "", // A governance proposal related to bonds
    homepage: "",
    twitter: "",
    github: "",
    medium: "",
    discord: "",
    telegram: "",
    staking: "",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: ["YOUR_DEPLOYMENT_ADDRESS"],
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "",
      symbol: "",
      logoUrl: "https://your-dao.defi/your-token-logo.png",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "",
        [CHAIN_ID.GOERLI_TESTNET]: "",
      },
      purchaseLinks: { [CHAIN_ID.ETHEREUM_MAINNET]: "https://app.uniswap.org/#/swap" }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "" },
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
