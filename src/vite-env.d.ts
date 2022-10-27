/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare enum ENVIRONMENT {
  PRODUCTION = "production",
  STAGING = "staging",
  TESTING = "testing",
  DEVELOPMENT = "development",
}

interface ImportMetaEnv {
  readonly VITE_ALCHEMY_MAINNET_KEY: string;
  readonly VITE_ALCHEMY_GOERLI_KEY: string;
  readonly VITE_ENVIROMENT: ENVIRONMENT;
  readonly VITE_MAINTENANCE: string;
  readonly VITE_TESTNET: string;

  readonly VITE_ALCHEMY_MAINNET_KEY: string;
  readonly VITE_ALCHEMY_GOERLI_KEY: string;

  // PROTOCOL SPECIFIC VARS
  readonly VITE_MARKET_REFERRAL_ADDRESS: string;
  readonly VITE_NO_FRONTEND_FEE_OWNERS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
