import { ENVIRONMENT } from "./environment";

/**Maps Order Services Servers according to environment*/
export const orderApiServerMap = {
  [ENVIRONMENT.DEVELOPMENT]: {
    url: "http://localhost:8081",
    description: "Development Server",
  },

  [ENVIRONMENT.TESTING]: {
    url: " https://public-api-server-testnet.up.railway.app/",
    description: "Testing Server",
  },

  [ENVIRONMENT.STAGING]: {
    url: "https://public-api-server-production.up.railway.app/",
    description: "Staging Server",
  },

  [ENVIRONMENT.PRODUCTION]: {
    url: "",
    description: "Production Server",
  },
};
