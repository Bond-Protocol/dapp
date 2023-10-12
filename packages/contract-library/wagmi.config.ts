import { defineConfig } from '@wagmi/cli';
import { actions } from '@wagmi/cli/plugins';

import { abiMap } from './src/modules/abi-map';

export default defineConfig({
  out: 'src/contracts.ts',
  contracts: Object.entries(abiMap).map(([name, abi]) => ({
    name,
    abi: abi.abi,
  })),
});
