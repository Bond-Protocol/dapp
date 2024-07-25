import { defineChain } from "viem";

//@ts-ignore
export default defineChain({
  id: 34443,
  name: "Mode Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    public: {
      http: ["https://mainnet.mode.network"],
    },
    default: {
      http: ["https://mainnet.mode.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Modescan",
      url: "https://modescan.io",
    },
  },
});
