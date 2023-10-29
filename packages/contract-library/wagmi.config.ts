import { defineConfig } from '@wagmi/cli';

import { abiMap } from './src/modules/abi-map';

export default defineConfig({
  out: 'src/abis/generated.ts',
  contracts: Object.entries(abiMap).map(([name, abi]) => ({
    name,
    abi: abi.abi,
  })),
});
