import { arbitrum, mainnet, optimism, polygon, base } from "@wagmi/chains";
import { environment } from "src/environment";
import { getIconsForChains } from "src/utils/get-icons-for-chains";
import { Chain, baseSepolia, bsc } from "viem/chains";
import { sonic } from "@bond-protocol/contract-library";

type _Chain = Chain & { logoUrl?: string };
export const TESTNETS = [baseSepolia].map(getIconsForChains);

export const MAINNETS = [
  mainnet,
  arbitrum,
  optimism,
  polygon,
  base,
  bsc,
  sonic,
];

export const SUPPORTED_CHAINS = [...TESTNETS, ...MAINNETS];
export const ACTIVE_CHAINS: _Chain[] = environment.isTestnet
  ? TESTNETS
  : MAINNETS;

export const ACTIVE_CHAIN_IDS = ACTIVE_CHAINS.map((c) => c.id);
