import { defineConfig } from "cypress";
import { setupBlockchainTasks } from "./cypress/plugins";

export default defineConfig({
  env: process.env,
  e2e: {
    video: false,
    screenshotOnRunFailure: false,
    baseUrl: process.env.APP_URL + "/#",
    setupNodeEvents(on, config) {
      setupBlockchainTasks(on);

      return config;
    },
  },
});
