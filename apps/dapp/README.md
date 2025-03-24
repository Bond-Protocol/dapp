# Bond Protocol dApp

## Dev setup (for now)

```bash
pnpm install

#Running
pnpm dev

#Other Commands
#Building for prod
pnpm build
#Serve prod/compiled code locally
pnpm preview
```

> [!WARNING]
> App still need the [caching API](https://github.com/Bond-Protocol/api) to be running in order to work, this should be deprecated in a near future

## Testing

E2E tests are setup using cypress and require a running foundry/anvil node.

- Existing setup forks base-sepolia from a specified block which contains a test-auction in desired state.
- `.env.testing` is used to setup environment variables used in testing.
- `src/mocks` uses `msw` to mock subgraph requests.
- `cypress/chain-state.json` contains the desired chain state for the tests to execute succesfully.
- `cypress/support/scaffold-tests.js` can be used to generate new chain state if needed (anvil needs to be run with --dump-state flag instead).

### Test Commands

```sh
pnpm test # Starts app server, local node and runs the full test suite in headless mode

pnpm local-rpc # Starts local node with existing chain state
pnpm test:run # Headless mode
pnpm test:open # Open browser mode -- useful for development
```

### New Chain Deployment Setup

- Add addresses to `packages/contract-library/.../address-provider.tsx`
- Add chain to `CHAIN_ID` enum in `packages/types/.../chains.ts`
- Add chain to `dapp/.../blockchain-provider.tsx`
- Add subgraph to `dapp/.../services/subgraph-endpoints.ts`
- Add chain handlers for defillama/coingecko to `dapp/.../defillama`
- If oracle markets are not available, add it to `dapp/.../create-market/config.ts`
