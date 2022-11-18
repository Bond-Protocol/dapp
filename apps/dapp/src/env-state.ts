const env = import.meta.env.VITE_ENVIRONMENT;

export enum ENVIRONMENT {
  PRODUCTION = "production",
  STAGING = "staging",
  TESTING = "testing",
  DEVELOPMENT = "development",
}

export const environment = {
  isProduction: env === ENVIRONMENT.PRODUCTION,
  isStaging: env === ENVIRONMENT.STAGING,
  isTesting: env === ENVIRONMENT.TESTING,
  isDevelopment: env === ENVIRONMENT.DEVELOPMENT,
  current: env as ENVIRONMENT,
};
