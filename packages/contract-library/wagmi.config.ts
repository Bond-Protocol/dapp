import { defineConfig } from '@wagmi/cli';
import { actions } from '@wagmi/cli/plugins';

import { abis } from './src/modules/contract-map';

export default defineConfig({
  out: 'src/contracts.ts',
  contracts: Object.entries(abis).map(([name, abi]) => ({
    name,
    abi: abi.abi,
  })),
});
