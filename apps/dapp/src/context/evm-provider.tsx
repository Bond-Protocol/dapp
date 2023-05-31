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
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  arbitrum,
  arbitrumGoerli,
  avalancheFuji,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygonMumbai,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { environment } from "src/environment";

const isTestnet = environment.isTestnet;

const { chains, provider } = configureChains(
  isTestnet
    ? [goerli, arbitrumGoerli, optimismGoerli, polygonMumbai, avalancheFuji]
    : [mainnet, arbitrum, optimism],
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
