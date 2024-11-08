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

export const berachainBartio: Chain = {
  id: 80084,
  network: "berachain-bartio",
  name: "Berachain bArtio",
  nativeCurrency: {
    decimals: 18,
    name: "BERA Token",
    symbol: "BERA",
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 109269,
    },
  },
  rpcUrls: {
    default: {
      http: [
        "https://berachain-bartio.g.alchemy.com/v2/HHcBoOtwJ9vBECT1Y3x2qqH-dHc53yyz",
      ],
    },
    public: {
      http: [
        "https://berachain-bartio.g.alchemy.com/v2/HHcBoOtwJ9vBECT1Y3x2qqH-dHc53yyz",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Berachain bArtio Beratrail",
      url: "https://bartio.beratrail.io",
    },
  },
  testnet: true,
};
