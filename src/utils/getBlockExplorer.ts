import { CHAINS } from "@bond-protocol/bond-library";

export const getBlockExplorer = (network: string, subpath = "") => {
  return {
    blockExplorerUrl: CHAINS.get(network)?.blockExplorerUrls[0].replace(
      "#",
      subpath
    ),
    blockExplorerName: CHAINS.get(network)?.blockExplorerName,
  };
};
