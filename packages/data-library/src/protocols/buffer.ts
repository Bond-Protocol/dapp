import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "Buffer Finance", // Your protocol's display name, formatted as it will appear in the BondProtocol dApp
  description:
    "Buffer Finance is a non-custodial, exotic options trading platform built to trade short-term price volatility and hedge risk of high-leverage positions.", // A short protocol description
  logoUrl: "https://github.com/Buffer-Finance/Buffer-Media/blob/main/new_logo_50_50.png?raw=true",
  // Links to landing page, socials and docs
  links: {
    governanceVote: "", // A governance proposal related to bonds
    homepage: "https://buffer.finance",
    staking: "https://app.buffer.finance/#/earn",
    twitter: "https://twitter.com/Buffer_Finance",
    github: "https://github.com/Buffer-Finance",
    medium: "https://buffer-finance.medium.com/",
    discord: "https://discord.com/invite/Hj4QF92Kdc",
    telegram: "https://t.me/bufferfinance",
    everipedia: "",
  },
  /*
    The address that you will use to execute the create market transaction, and which will be allowed
    to spend your payout tokens. This can be a multisig or other contract, or a wallet.
  */
  issuerAddresses: {
    [CHAIN_ID.ARBITRUM_MAINNET]: ["0xfa1e2DD94D6665bb964192Debac09c16242f8a48"],
    [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]: ["0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D"],
  },
  /*
   Tokens specific to your protocol like your governance token or LPs can be added here.

   If you're looking to add a strategic asset, stablecoin or an otherwise common base please check the
   tokens directory to see if it exists already, if not, add it there rather than here.
  */
  tokens: [
    {
      name: "Buffer Finance Token",
      symbol: "BFR",
      logoUrl: "https://github.com/Buffer-Finance/Buffer-Media/blob/main/new_logo_50_50.png?raw=true",
      // Token contract addresses
      addresses: {
        [CHAIN_ID.ARBITRUM_MAINNET]: "0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D",
        [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]: "0x89fEF05446aEA764C53a2f09bB763876FB57ea8E",
      },
      purchaseLinks: { [CHAIN_ID.ARBITRUM_MAINNET]: "https://app.openocean.finance/CLASSIC#/ARBITRUM/USDC/BFR" }, // Where to acquire your token
      priceSources: [
        /*
           Check out our docs for supported price sources and their usage.
           Although custom price feeds are supported, some features such as bond price history charts
           do not currently support custom price feeds.
        */
        { source: "coingecko", apiId: "ibuffer-token" },
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
