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
  mainnet,
  arbitrum,
  goerli,
  arbitrumGoerli,
  optimismGoerli,
  polygonMumbai,
  avalancheFuji,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { environment } from "src/environment";
import { CHAINS } from "@bond-protocol/bond-library";

const getIconsForChains = (c: any) => {
  const logoUrl = Array.from(CHAINS.values()).find(
    (chain) => Number(chain.chainId) === Number(c.id)
  )?.image;

  return { ...c, logoUrl };
};

export const testnets = [
  goerli,
  arbitrumGoerli,
  optimismGoerli,
  polygonMumbai,
  avalancheFuji,
].map(getIconsForChains);

export const mainnets = [mainnet, arbitrum].map(getIconsForChains);

export const SUPPORTED_CHAINS = [...testnets, ...mainnets];
export const ACTIVE_CHAINS = environment.isTestnet ? testnets : mainnets;
export const ACTIVE_CHAIN_IDS = ACTIVE_CHAINS.map((c) => c.id);

const { chains, provider } = configureChains(
  //@ts-ignore
  environment.isTestnet ? testnets : mainnets,
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

export const EvmProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider theme={darkTheme()} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
