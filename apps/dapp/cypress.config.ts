import { defineConfig } from "cypress";
import { setupBlockchainTasks } from "./cypress/plugins";

export default defineConfig({
  e2e: {
    experimentalWebKitSupport: true,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      setupBlockchainTasks(on);

      return config;
    },
  },
});
