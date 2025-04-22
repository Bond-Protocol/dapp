import { environment } from "src/environment";
import { ANVIL_RPC_URL } from "./auto-signer";
import { PublicClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { deployments } from "@bond-protocol/contract-library";
const key = import.meta.env.VITE_ALCHEMY_RPC_KEY;

const rpcConfigs = deployments.map((d) => ({
  chain: d.chain,
  endpoint: d.getRpcURL(key),
}));

const testRpcConfigs = [
  {
    chain: baseSepolia,
    endpoint: ANVIL_RPC_URL,
  },
];

export const config = environment.enableAutoSigner
  ? testRpcConfigs
  : rpcConfigs;

export const clients: Record<number, PublicClient> = config.reduce(
  (clients, { chain, endpoint }) => {
    return {
      ...clients,
      [chain.id]: createPublicClient({ chain, transport: http(endpoint) }),
    };
  },
  {}
);
