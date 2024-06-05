# Bond Protocol dApp

### Dev setup (for now)

```bash
yarn install

#Running
yarn dev

#Other Commands

#Building for prod
yarn build
#Serve prod/compiled code locally
yarn preview
```

### New Chain Deployment Setup

- Add addresses to `packages/contract-library/.../address-provider.tsx`
- Add chain to `CHAIN_ID` enum in `packages/types/.../chains.ts`
- Add chain to `dapp/.../blockchain-provider.tsx`
- Add subgraph to `dapp/.../services/subgraph-endpoints.ts`
- Add chain handlers for defillama/coingecko to `dapp/.../defillama`
- If oracle markets are not available, add it to `dapp/.../create-market/config.ts`
