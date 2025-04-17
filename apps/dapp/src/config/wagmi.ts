import "@rainbow-me/rainbowkit/styles.css";
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";

import { environment } from "src/environment";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { Chain } from "viem";
import { autoSignerWallet, ANVIL_RPC_URL } from "./auto-signer";
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

type _Chain = Chain & { logoUrl?: string };

const anvilProvider = jsonRpcProvider({ rpc: () => ({ http: ANVIL_RPC_URL }) });

export const providers = environment.enableAutoSigner
  ? [anvilProvider]
  : [
      alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_RPC_KEY }),
      publicProvider(),
    ];

export const getWallets = (chains: _Chain[]) => {
  return environment.enableAutoSigner
    ? [autoSignerWallet]
    : [
        metaMaskWallet({ chains, projectId }),
        rainbowWallet({ chains, projectId }),
        walletConnectWallet({ chains, projectId }),
        coinbaseWallet({ chains, appName: "BondProtocol" }),
        injectedWallet({ chains, shimDisconnect: true }),
      ];
};
