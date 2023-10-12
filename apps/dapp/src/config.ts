import { ENVIRONMENT } from "./environment";

/**Maps Order Services Servers according to environment*/
export const orderApiServerMap = {
  [ENVIRONMENT.DEVELOPMENT]: {
    url: "http://localhost:8081",
    description: "Development Server",
  },

  [ENVIRONMENT.TESTING]: {
    url: "https://public-api-fr6d.onrender.com/",
    description: "Testing Server",
  },

  [ENVIRONMENT.STAGING]: {
    url: "",
    description: "Staging Server",
  },

  [ENVIRONMENT.PRODUCTION]: {
    url: "",
    description: "Production Server",
  },
};
