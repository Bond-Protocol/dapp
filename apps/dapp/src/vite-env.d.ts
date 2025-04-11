/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="./types/openapi.d.ts" />

declare enum ENVIRONMENT {
  PRODUCTION = "production",
  STAGING = "staging",
  TESTING = "testing",
  DEVELOPMENT = "development",
}

type BooleanString = "true" | "false";

interface ImportMetaEnv {
  readonly VITE_ALCHEMY_RPC_KEY: string;

  readonly VITE_ENVIROMENT: ENVIRONMENT;
  readonly VITE_MAINTENANCE: string;

  // PROTOCOL SPECIFIC VARS
  readonly VITE_MARKET_REFERRAL_ADDRESS: string;
  readonly VITE_NO_FRONTEND_FEE_OWNERS: string;
  readonly VITE_COMMIT_HASH: string;

  //Testing
  readonly VITE_TESTNET: BooleanString;
  readonly VITE_ENABLE_MOCK_API: BooleanString;
  readonly VITE_ENABLE_AUTO_SIGNER: BooleanString;

  // Features
  readonly VITE_FEATURE_LIMIT_ORDERS: BooleanString;
  readonly VITE_FEATURE_ORACLE_BONDS: BooleanString;
  readonly VITE_FEATURE_CACHING_API: BooleanString;
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
