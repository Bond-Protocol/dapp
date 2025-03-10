import {
  arbitrum,
  arbitrumGoerli,
  mainnet,
  optimism,
  polygon,
  base,
} from "@wagmi/chains";
import { environment } from "src/environment";
import { ANVIL_RPC_URL } from "./auto-signer";
import { PublicClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
const key = import.meta.env.VITE_ALCHEMY_RPC_KEY;

const rpcConfigs = [
  {
    chain: mainnet,
    endpoint: ` https://eth-mainnet.g.alchemy.com/v2/${key}`,
  },
  {
    chain: arbitrumGoerli,
    endpoint: `https://arb-goerli.g.alchemy.com/v2/${key}`,
  },
  {
    chain: arbitrum,
    endpoint: `https://arb-mainnet.g.alchemy.com/v2/${key}`,
  },
  {
    chain: optimism,
    endpoint: `https://opt-mainnet.g.alchemy.com/v2/${key}`,
  },
  {
    chain: polygon,
    endpoint: `https://polygon-mainnet.g.alchemy.com/v2/${key}`,
  },
  {
    chain: base,
    endpoint: `https://base-mainnet.g.alchemy.com/v2/${key}`,
  },
  {
    chain: baseSepolia,
    endpoint: `https://base-sepolia.g.alchemy.com/v2/${key}`,
  },
];

const testRpcConfigs = [
  {
    chain: baseSepolia,
    endpoint: ANVIL_RPC_URL,
  },
];

export const config = environment.enableMockAPI ? testRpcConfigs : rpcConfigs;

export const clients: Record<number, PublicClient> = config.reduce(
  (clients, { chain, endpoint }) => {
    return {
      ...clients,
      [chain.id]: createPublicClient({ chain, transport: http(endpoint) }),
    };
  },
  {}
);
