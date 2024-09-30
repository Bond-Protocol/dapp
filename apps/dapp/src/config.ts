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
  "1": "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-ethereum/api", //mainnet
  "42161":
    "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-arbitrum/api", //arb
  "10": "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-optimism/api", //op
  "8453":
    "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-base/api", //base
  "137":
    "https://subgraph.satsuma-prod.com//spaces-team/bond-protocol-polygon/api", //polygon
  "56": "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/bond-protocol-bsc/0.0.2/gn", //bsc
  "34443":
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/bond-protocol-mode/0.0.2/gn", //mode
};

//Added to prevent leaking to prod and triggering unnecessary queries
export const testnetSubgraphs =
  !environment.isProduction && environment.isTestnet
    ? {
        "84532":
          "https://subgraph.satsuma-prod.com/35414fbc50a7/spaces-team/bond-protocol-base-sepolia/api",
        "80084":
          "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/bond-protocol-bera-bartio/0.0.2/gn",
      }
    : {};
