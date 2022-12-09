import { CHAINS } from '@bond-protocol/bond-library';

export const getBlockExplorer = (network: string, subpath = '') => {
  const _network = network === 'arbitrum-one' ? 'arbitrum' : network;
  return {
    blockExplorerUrl: CHAINS.get(_network)?.blockExplorerUrls[0].replace(
      '#',
      subpath,
    ),
    blockExplorerName: CHAINS.get(_network)?.blockExplorerName,
  };
};
