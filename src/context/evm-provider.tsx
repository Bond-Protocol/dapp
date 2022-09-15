import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import type { FC, ReactNode } from "react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.goerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Bond Protocol",
  chains,
});

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
