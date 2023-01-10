import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import type { FC, ReactNode } from "react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { environment } from "src/env-state";

const isTestnet = !environment.isProduction;

const { chains, provider } = configureChains(
  isTestnet
    ? [chain.goerli, chain.arbitrumGoerli]
    : [chain.mainnet, chain.arbitrum],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains }),
      rainbowWallet({ chains }),
      coinbaseWallet({
        appName: "BondProtocol",
        chains: chains,
      }),
      walletConnectWallet({ chains }),
      injectedWallet({ chains, shimDisconnect: true }),
    ],
  },
]);

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

//TODO: (aphex) wagmi is causing bundle size to go up dramatically fsr
export const EvmProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider theme={darkTheme()} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
