import { environment } from "src/environment";
import { getIconsForChains } from "src/utils/get-icons-for-chains";
import { Chain } from "viem/chains";
import { mainnetDeployments } from "@bond-protocol/contract-library/src/deployments/mainnets";
import { testnetDeployments } from "@bond-protocol/contract-library/src/deployments/testnets";

type _Chain = Chain & { logoUrl?: string };

export const TESTNETS = testnetDeployments
  .map((d) => d.chain)
  .map(getIconsForChains);

export const MAINNETS = mainnetDeployments.map((d) => d.chain);

export const SUPPORTED_CHAINS = [...TESTNETS, ...MAINNETS];
export const ACTIVE_CHAINS: _Chain[] = environment.isTestnet
  ? TESTNETS
  : MAINNETS;

export const ACTIVE_CHAIN_IDS = ACTIVE_CHAINS.map((c) => c.id);
