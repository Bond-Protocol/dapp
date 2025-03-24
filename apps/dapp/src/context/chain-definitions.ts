//Adds chains not avalaible in viem/wagmi

import { Chain } from "@rainbow-me/rainbowkit";

export const mode: Chain = {
  network: "mode",
  name: "Mode",
  id: 34443,
  iconUrl:
    "https://raw.githubusercontent.com/mode-network/brandkit/main/Assets/Logo/Token.svg",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    public: {
      http: ["https://mainnet.mode.network/"],
    },
    default: {
      http: ["https://mainnet.mode.network/"],
    },
  },
};
