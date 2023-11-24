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
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  arbitrumGoerli,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
} from "wagmi/chains";
import { environment } from "src/environment";
import { CHAINS } from "@bond-protocol/contract-library";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Chain, createPublicClient, http, PublicClient } from "viem";

export const testnets = [goerli, arbitrumGoerli, optimismGoerli].map(
  getIconsForChains
);

export const mainnets = [mainnet, arbitrum, optimism];

type _Chain = Chain & { logoUrl?: string };

export const SUPPORTED_CHAINS = [...testnets, ...mainnets];
export const ACTIVE_CHAINS: _Chain[] = environment.isTestnet
  ? testnets
  : mainnets;

export const ACTIVE_CHAIN_IDS = ACTIVE_CHAINS.map((c) => c.id);
export const MAINNETS = mainnets;

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const { chains, publicClient } = configureChains(
  environment.isTestnet ? testnets : mainnets,
  [
    //alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_MAINNET_KEY }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains, projectId }),
      rainbowWallet({ chains, projectId }),
      walletConnectWallet({ chains, projectId }),
      coinbaseWallet({ chains, appName: "BondProtocol" }),
      injectedWallet({ chains, shimDisconnect: true }),
    ],
  },
]);

const config = createConfig({ publicClient, connectors, autoConnect: true });

const setup = [
  {
    chain: mainnet,
    endpoint: ` https://eth-mainnet.g.alchemy.com/v2/${
      import.meta.env.VITE_ALCHEMY_MAINNET_KEY
    }`,
  },
  {
    chain: goerli,
    endpoint: `https://eth-goerli.g.alchemy.com/v2/${
      import.meta.env.VITE_ALCHEMY_GOERLI_KEY
    }`,
  },

  {
    chain: arbitrumGoerli,
    endpoint: `https://arb-goerli.g.alchemy.com/v2/${
      import.meta.env.VITE_ALCHEMY_ARBITRUM_GOERLI_KEY
    }`,
  },

  {
    chain: arbitrum,
    endpoint: `https://eth-mainnet.g.alchemy.com/v2/${
      import.meta.env.VITE_ALCHEMY_MAINNET_KEY
    }`,
  },
  {
    chain: optimism,
    endpoint: `https://opt-mainnet.g.alchemy.com/v2/${
      import.meta.env.VITE_ALCHEMY_OPTIMISM_MAINNET_KEY
    }`,
  },
  {
    chain: optimismGoerli,
    endpoint: `https://opt-goerli.g.alchemy.com/v2/${
      import.meta.env.VITE_ALCHEMY_OPTIMISM_GOERLI_KEY
    }`,
  },
];

export const clients: Record<number, PublicClient> = setup.reduce(
  (clients, { chain, endpoint }) => {
    return {
      ...clients,
      [chain.id]: createPublicClient({ chain, transport: http(endpoint) }),
    };
  }
);

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

function getIconsForChains(c: any) {
  const logoUrl = Array.from(CHAINS.values()).find(
    (chain) => Number(chain.chainId) === Number(c.id)
  )?.image;

  return { ...c, logoUrl };
}
