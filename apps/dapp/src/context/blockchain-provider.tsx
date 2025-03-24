import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import type { FC, ReactNode } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { getWallets, providers } from "src/config/wagmi";
import { clients } from "src/config/public-clients";
import { ACTIVE_CHAINS } from "src/config/chains";

const { chains, publicClient } = configureChains(ACTIVE_CHAINS, providers);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: getWallets(chains),
  },
]);

const config = createConfig({ publicClient, connectors, autoConnect: true });

export { clients };

export const BlockchainProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={darkTheme()} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
