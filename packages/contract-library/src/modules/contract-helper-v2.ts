import { Address, PublicClient, WalletClient, getContract } from 'viem';
import contracts, { Auctioneers, abiMap, auctioneerMap } from './contract-map';
import { getAddressesV2 } from './address-provider';
import { aggregatorABI } from 'src/contracts';

export function getChainId(client: PublicClient | WalletClient) {
  const chainId = client.chain?.id;
  if (!chainId) throw new Error('Unable to get Chain Id from client');
  return chainId;
}

export function getAuctioneerFactoryForName(
  auctioneerName: Auctioneers,
  address: Address,
  publicClient: PublicClient,
) {
  let abi = auctioneerMap[auctioneerName];

  return getContract({ publicClient, address, abi });
}

export function getAggregator(publicClient: PublicClient) {
  const chainId = getChainId(publicClient);
  const address = getAddressesV2(chainId).aggregator;
  return getContract({ publicClient, address, abi: abiMap.aggregator });
}
