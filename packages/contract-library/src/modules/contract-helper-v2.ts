import { Address, PublicClient, WalletClient, getContract } from 'viem';
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
  publicClient: PublicClient,
) {
  let abi = auctioneerAbis[auctioneerName];

  return getContract({ publicClient, address, abi });
}

export function getAggregator(publicClient: PublicClient) {
  const address = getAddressesV2(publicClient).aggregator;

  return getContract({ publicClient, address, abi: abis.aggregator });
}

export function getAuthorithy(publicClient: PublicClient) {
  const address = getAddressesV2(publicClient).authority;

  return getContract({ publicClient, address, abi: abis.authority });
}

export function getBaseTeller(walletClient: WalletClient, address: Address) {
  return getContract({ walletClient, abi: abis.baseTeller, address });
}

export function getTeller(publicClient: PublicClient, bondType: BondType) {
  const { teller } = getAddressesForType(publicClient, bondType);

  const abi = bondType.includes('term')
    ? abis.fixedTermTeller
    : abis.fixedExpiryTeller;

  return getContract({ publicClient, address: teller, abi });
}

export function getAddressesForType(
  publicClient: PublicClient,
  bondType: BondType,
) {
  const { fixedTermTeller, fixedExpiryTeller } = getAddressesV2(publicClient);

  const isFixedTerm = bondType.includes('term');

  const teller = isFixedTerm ? fixedTermTeller : fixedExpiryTeller;

  const auctioneer = getAuctioneerByBondType(publicClient, bondType);

  return { teller, auctioneer };
}

export function getAuctioneerForCreate(
  publicClient: PublicClient,
  bondType: BondType,
) {
  const abi = auctioneersByType[bondType];
  const address = getAuctioneerByBondType(publicClient, bondType);

  return getContract({ publicClient, abi, address });
}
