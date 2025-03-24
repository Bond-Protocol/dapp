/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="./types/openapi.d.ts" />

declare enum ENVIRONMENT {
  PRODUCTION = "production",
  STAGING = "staging",
  TESTING = "testing",
  DEVELOPMENT = "development",
}

interface ImportMetaEnv {
  readonly VITE_ALCHEMY_RPC_KEY: string;
  readonly VITE_ALCHEMY_MAINNET_KEY: string;
  readonly VITE_ALCHEMY_GOERLI_KEY: string;
  readonly VITE_ENVIROMENT: ENVIRONMENT;
  readonly VITE_MAINTENANCE: string;
  readonly VITE_TESTNET: string;

  readonly VITE_ALCHEMY_MAINNET_KEY: string;
  readonly VITE_ALCHEMY_ARBITRUM_MAINNET_KEY: string;
  readonly VITE_ALCHEMY_OPTIMISM_MAINNET_KEY: string;

  readonly VITE_ALCHEMY_GOERLI_KEY: string;
  readonly VITE_ALCHEMY_ARBITRUM_GOERLI_KEY: string;
  readonly VITE_ALCHEMY_OPTIMISM_GOERLI_KEY: string;

  readonly VITE_ALCHEMY_POLYGON_MAINNET_KEY: string;
  readonly VITE_ALCHEMY_POLYGON_TESTNET_KEY: string;

  readonly VITE_ALCHEMY_BASE_MAINNET_KEY: string;
  readonly VITE_ALCHEMY_BASE_SEPOLIA_KEY: string;

  // PROTOCOL SPECIFIC VARS
  readonly VITE_MARKET_REFERRAL_ADDRESS: string;
  readonly VITE_NO_FRONTEND_FEE_OWNERS: string;
  // more env variables...
  readonly VITE_COMMIT_HASH: string;

  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_ENABLE_AUTO_SIGNER: string;
}

declare const __COMMIT_HASH__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare class BondProtocolError extends Error {
  constructor(message: string, prefix = "") {
    super(`${prefix}: ${message}`);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
