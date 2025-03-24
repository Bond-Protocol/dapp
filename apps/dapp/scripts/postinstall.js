const { execSync } = require("child_process");

/**
 * Installs Anvil if it's not already
 */

try {
  execSync("anvil --version", { stdio: "ignore" });
  console.log("Anvil already installed, skipping installation");
} catch (e) {
  console.log("Installing Foundry (Anvil)...");
  try {
    execSync("curl -L https://foundry.paradigm.xyz | bash", {
      stdio: "inherit",
    });

    execSync(". ~/.foundry/bin/foundryup", {
      stdio: "inherit",
      shell: "/bin/bash",
    });

    console.log("✅Anvil installed successfully");
  } catch (err) {
    console.error("Failed to install Anvil:", err);
  }
}
