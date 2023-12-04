import { CHAINS } from "core/chains";

//@TODO: Deprecate this
export const getBlockExplorer = (chainId: string, subpath = "") => {
  return {
    blockExplorerUrl:
      CHAINS.get(chainId)?.blockExplorerUrls[0].replace("#", subpath) ?? "",
    blockExplorerName: CHAINS.get(chainId)?.blockExplorerName ?? "",
  };
};
