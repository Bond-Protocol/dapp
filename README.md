# ![logo](packages/ui/src/assets/logo-24.svg) Frontend Monorepo

## Usage

Clone repo and:

### Setup

```bash
pnpm && pnpm build
```

### Dev Mode

You should use the flag `--filter=<package_name>` to run commands only on a specific package like:

```bash
pnpm dev --filter=dapp
```

This would only run the `dapp` package on dev mode while using the built code from other dependencies like the ui or contract-library, making reloading faster

This command can also be chained like:

```bash
pnpm dev --filter=dapp --filter=ui
```

### Test Mode

To simply run tests use

```bash
pnpm test
```

For developing tests or debugging its useful to have the cypress dashboard, open it with:

```bash
cd apps/dapp
pnpm test:open
```

### Enabling new Chains

- Check examples under `packages/contract-library/src/deployments` for the configuration structure
- Update `../deployments/(mainnets/testnets)/index.ts` to include the newly added deployment configuration
- If oracle markets or fixed expiry is available, add it to `dapp/.../create-market/config.ts`

## Useful Links

[Turbopack](https://turbo.build/repo/docs)
[Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress)
