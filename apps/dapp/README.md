# Bond Protocol dApp

## Dev setup

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

### Enabling new Chains

- Check examples under `packages/contract-library/src/deployments` for the configuration structure
- Update `../deployments/(mainnets/testnets)/index.ts` to include the newly added deployment configuration
- If oracle markets or fixed expiry is available, add it to `dapp/.../create-market/config.ts`
