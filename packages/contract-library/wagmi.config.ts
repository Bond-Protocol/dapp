import { defineConfig } from "@wagmi/cli";

import { abiMap } from "./src/core/raw-abis";

export default defineConfig({
  out: "src/abis/generated.ts",
  contracts: Object.entries(abiMap).map(([name, abi]) => ({
    name,
    abi: abi.abi,
  })),
});
