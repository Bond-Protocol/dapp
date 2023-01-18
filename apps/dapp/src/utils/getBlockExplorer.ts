import { CHAINS } from "@bond-protocol/bond-library";

export const getBlockExplorer = (chainId: string, subpath = "") => {
  return {
    blockExplorerUrl: CHAINS.get(chainId)?.blockExplorerUrls[0].replace(
      "#",
      subpath
    ),
    blockExplorerName: CHAINS.get(chainId)?.blockExplorerName,
  };
};
