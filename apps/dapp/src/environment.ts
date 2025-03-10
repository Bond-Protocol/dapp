const env = import.meta.env.VITE_ENVIRONMENT;
const testnet = import.meta.env.VITE_TESTNET;
const mockBackend = import.meta.env.VITE_MOCK_API_REQUESTS;

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
  enableMockAPI: mockBackend === "true",
});
