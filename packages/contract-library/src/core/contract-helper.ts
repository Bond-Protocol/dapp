import { Address, PublicClient, WalletClient } from "viem";
import {
  getAuctioneerByBondType,
  getAddresses,
  Auctioneer,
  BondType,
  auctioneersByType,
} from "core";
import { abis, auctioneerAbis } from "abis";

export function getChainId(client: PublicClient | WalletClient) {
  const chainId = client.chain?.id;
  if (!chainId) throw new Error("Unable to get Chain Id from client");
  return chainId;
}

export function getAuctioneerAbiForName(auctioneerName: Auctioneer) {
  return auctioneerAbis[auctioneerName];
}

export function getAggregator(chainId: number) {
  const address = getAddresses(chainId).aggregator;

  return { address: address as Address, abi: abis.aggregator };
}

export function getAuthorithy(chainId: number) {
  const address = getAddresses(chainId).authority;

  return { address, abi: abis.authority };
}

export function getBaseTeller(address: Address) {
  return { abi: abis.baseTeller, address };
}

export function getTeller(chainId: number, bondType: BondType) {
  const { teller } = getAddressesForType(chainId, bondType);

  const abi = bondType.includes("term")
    ? abis.fixedTermTeller
    : abis.fixedExpiryTeller;

  return { address: teller, abi };
}

export function getAddressesForType(chainId: number, bondType: BondType) {
  const { fixedTermTeller, fixedExpiryTeller } = getAddresses(chainId);

  const isFixedTerm = bondType.includes("term");

  const teller = isFixedTerm ? fixedTermTeller : fixedExpiryTeller;

  const auctioneer = getAuctioneerByBondType(chainId, bondType);

  return { teller, auctioneer };
}

export function getAuctioneerForCreate(chainId: number, bondType: BondType) {
  const abi = auctioneersByType[bondType];
  const address = getAuctioneerByBondType(chainId, bondType);

  return { abi, address };
}
