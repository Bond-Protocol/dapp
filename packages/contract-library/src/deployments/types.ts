import { ContractAddresses } from "../..";
import { Chain } from "viem";

export type BondDeployment = {
  addresses: Partial<ContractAddresses>;
  chain: Chain;
  subgraphURL: string;
  getRpcURL: (key?: string) => string;
};
