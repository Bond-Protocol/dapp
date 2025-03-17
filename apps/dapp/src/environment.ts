const env = import.meta.env.VITE_ENVIRONMENT;
const testnet = import.meta.env.VITE_TESTNET;
const mockAPI = import.meta.env.VITE_ENABLE_MOCK_API;
const autoSigner = import.meta.env.VITE_ENABLE_AUTO_SIGNER;

export enum ENVIRONMENT {
  PRODUCTION = "production",
  STAGING = "staging",
  TESTING = "testing",
  DEVELOPMENT = "development",
}

export const environment = Object.freeze({
  isProduction: env === ENVIRONMENT.PRODUCTION,
  isStaging: env === ENVIRONMENT.STAGING,
  isTesting: env === ENVIRONMENT.TESTING,
  isDevelopment: env === ENVIRONMENT.DEVELOPMENT,
  isTestnet: testnet === "true",
  current: env as ENVIRONMENT,
  enableMockAPI: mockAPI === "true",
  enableAutoSigner: autoSigner === "true",
});
