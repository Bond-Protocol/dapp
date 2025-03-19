import { testClient } from "cypress/support/test-client";
import { Hex } from "viem";

function setupBlockchainTasks(on: Cypress.PluginEvents) {
  on("task", {
    async takeSnapshot() {
      return testClient.snapshot();
    },

    async revertSnapshot(id: Hex) {
      await testClient.revert({ id });
      return null;
    },

    async setNextBlockTimestamp(timestamp: string) {
      await testClient.setNextBlockTimestamp({
        timestamp: BigInt(timestamp),
      });
      return null;
    },
  });
}

export { setupBlockchainTasks };
