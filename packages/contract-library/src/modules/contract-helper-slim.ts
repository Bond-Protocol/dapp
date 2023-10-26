import { Address, PublicClient, WalletClient } from 'viem';
import { abis, auctioneerAbis } from './contract-map';
import { getAuctioneerByBondType, getAddressesV2 } from './address-provider';
import { Auctioneers, BondType, auctioneersByType } from './enums';

export function getChainId(client: PublicClient | WalletClient) {
  const chainId = client.chain?.id;
  if (!chainId) throw new Error('Unable to get Chain Id from client');
  return chainId;
}

export function getAuctioneerFactoryForName(
  auctioneerName: Auctioneers,
  address: Address,
) {
  let abi = auctioneerAbis[auctioneerName];

  return { address, abi };
}

export function getAggregator(chainId: number) {
  const address = getAddressesV2(chainId).aggregator;

  return { address, abi: abis.aggregator };
}

export function getAuthorithy(chainId: number) {
  const address = getAddressesV2(chainId).authority;

  return { address, abi: abis.authority };
}

export function getBaseTeller(address: Address) {
  return { abi: abis.baseTeller, address };
}

export function getTeller(chainId: number, bondType: BondType) {
  const { teller } = getAddressesForType(chainId, bondType);

  const abi = bondType.includes('term')
    ? abis.fixedTermTeller
    : abis.fixedExpiryTeller;

  return { address: teller, abi };
}

export function getAddressesForType(chainId: number, bondType: BondType) {
  const { fixedTermTeller, fixedExpiryTeller } = getAddressesV2(chainId);

  const isFixedTerm = bondType.includes('term');

  const teller = isFixedTerm ? fixedTermTeller : fixedExpiryTeller;

  const auctioneer = getAuctioneerByBondType(chainId, bondType);

  return { teller, auctioneer };
}

export function getAuctioneerForCreate(chainId: number, bondType: BondType) {
  const abi = auctioneersByType[bondType];
  const address = getAuctioneerByBondType(chainId, bondType);

  return { abi, address };
}
