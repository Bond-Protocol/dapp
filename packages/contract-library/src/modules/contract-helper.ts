import { Provider } from '@ethersproject/providers';
import { BigNumberish, Signer } from 'ethers';
import { getAddresses } from './address-provider';
import {
  Aggregator,
  Aggregator__factory,
  Auctioneer,
  Auctioneer__factory,
  Authority,
  Authority__factory,
  BondTeller,
  BondTeller__factory,
  FixedExpirationTeller,
  FixedExpirationTeller__factory,
  FixedTermTeller,
  FixedTermTeller__factory,
} from 'types';

export enum BOND_TYPE {
  FIXED_EXPIRY = 'fixed-expiration',
  FIXED_TERM = 'fixed-term',
}

export function getAggregator(
  providerOrSigner: Signer | Provider,
  chainId: string,
): Aggregator {
  return Aggregator__factory.connect(
    getAddresses(chainId).aggregator,
    providerOrSigner,
  );
}

export function getAuthority(
  providerOrSigner: Signer | Provider,
  chainId: string,
): Authority {
  return Authority__factory.connect(
    getAddresses(chainId).authority,
    providerOrSigner,
  );
}

export function getBaseBondTeller(
  providerOrSigner: Signer | Provider,
  address: string,
): BondTeller {
  return BondTeller__factory.connect(address, providerOrSigner);
}

export function getTellerContract(
  providerOrSigner: Signer | Provider,
  bondType: BOND_TYPE,
  chainId: string,
): FixedExpirationTeller | FixedTermTeller {
  switch (bondType) {
    case BOND_TYPE.FIXED_EXPIRY:
      return FixedExpirationTeller__factory.connect(
        getAddresses(chainId).fixedExpirationTeller,
        providerOrSigner,
      );
    case BOND_TYPE.FIXED_TERM:
      return FixedTermTeller__factory.connect(
        getAddresses(chainId).fixedTermTeller,
        providerOrSigner,
      );
  }
}

export function getAuctioneerForCreate(
  providerOrSigner: Signer | Provider,
  bondType: BOND_TYPE,
  chainId: string,
): Auctioneer {
  switch (bondType) {
    case BOND_TYPE.FIXED_EXPIRY:
      return Auctioneer__factory.connect(
        getAddresses(chainId).fixedExpirationAuctioneer,
        providerOrSigner,
      );
    case BOND_TYPE.FIXED_TERM:
      return Auctioneer__factory.connect(
        getAddresses(chainId).fixedTermAuctioneer,
        providerOrSigner,
      );
  }
}

export async function getAuctioneerFromAggregator(
  marketId: BigNumberish,
  chainId: string,
  providerOrSigner: Signer | Provider,
): Promise<Auctioneer> {
  const aggregator = getAggregator(providerOrSigner, chainId);
  const auctioneerAddress = await aggregator.getAuctioneer(marketId, {});
  return Auctioneer__factory.connect(auctioneerAddress, providerOrSigner);
}
