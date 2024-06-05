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

- Add addresses to `packages/contract/address-provider.tsx`
- Add chain to `CHAIN_ID` enum in `packages/types/src/chains.ts`
- Add chain to `dapp/src/context/blockchain-provider.tsx`
- Add subgraph to `services/subgraph-endpoints.ts`
- add chain handlers for defillama/coingecko
