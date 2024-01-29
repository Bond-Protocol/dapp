import { defineConfig } from "@wagmi/cli";

import { abiMap } from "./src/abis/sources";

export default defineConfig({
  out: "src/abis/generated.ts",
  //@ts-ignore
  contracts: Object.entries(abiMap).map(([name, abi]) => ({
    name,
    abi: abi.abi,
  })),
});
