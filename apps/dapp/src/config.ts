import { ENVIRONMENT, environment } from "./environment";

/**Maps Order Services Servers according to environment*/
export const orderApiServerMap = {
  [ENVIRONMENT.DEVELOPMENT]: {
    url: "http://localhost:8081",
    description: "Development Server",
  },

  [ENVIRONMENT.TESTING]: {
    url: "https://public-api-server-testnet.up.railway.app/",
    description: "Testing Server",
  },

  [ENVIRONMENT.STAGING]: {
    url: "https://public-api-server-production.up.railway.app/",
    description: "Staging Server",
  },

  [ENVIRONMENT.PRODUCTION]: {
    url: "https://public-api-server-production.up.railway.app/",
    description: "Production Server",
  },
};

export const mainnetSubgraphs = {
  "1": "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-ethereum/api",
  "42161":
    "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-arbitrum/api",
  "10": "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-optimism/api",
  "8453":
    "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-base/api",
  "137":
    "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-polygon/api",
  "146":
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/bond-protocol-sonic-mainnet/api",
  "56": "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/bond-protocol-bsc/api",
};

//Added to prevent leaking to prod and triggering unnecessary queries
export const testnetSubgraphs =
  !environment.isProduction && environment.isTestnet
    ? {
        "84532":
          "https://subgraph.satsuma-prod.com/35414fbc50a7/spaces-team/bond-protocol-base-sepolia/api",
      }
    : {};
