import { Provider } from '@ethersproject/providers';
import { BigNumberish, Signer } from 'ethers';
import { getAddresses, getAddressesForType } from './address-provider';
import {
  Aggregator,
  Aggregator__factory,
  Auctioneer,
  Auctioneer__factory,
  Authority,
  Authority__factory,
  BondFixedExpCDA,
  BondFixedExpCDA__factory,
  BondFixedExpFPA,
  BondFixedExpFPA__factory,
  BondFixedExpOFDA,
  BondFixedExpOFDA__factory,
  BondFixedExpOSDA,
  BondFixedExpOSDA__factory,
  BondFixedTermCDA,
  BondFixedTermCDA__factory,
  BondFixedTermFPA,
  BondFixedTermFPA__factory,
  BondFixedTermOFDA,
  BondFixedTermOFDA__factory,
  BondFixedTermOSDA,
  BondFixedTermOSDA__factory,
  BondTeller,
  BondTeller__factory,
  FixedExpirationTeller,
  FixedExpirationTeller__factory,
  FixedTermTeller,
  FixedTermTeller__factory,
} from 'types';

export enum BOND_TYPE {
  FIXED_EXPIRY_DEPRECATED = 'fixed-expiry',
  FIXED_EXPIRY_SDA = 'fixed-expiry-sda',
  FIXED_EXPIRY_FPA = 'fixed-expiry-fpa',
  FIXED_EXPIRY_OFDA = 'fixed-expiry-ofda',
  FIXED_EXPIRY_OSDA = 'fixed-expiry-osda',
  FIXED_TERM_DEPRECATED = 'fixed-term',
  FIXED_TERM_SDA = 'fixed-term-sda',
  FIXED_TERM_FPA = 'fixed-term-fpa',
  FIXED_TERM_OFDA = 'fixed-term-ofda',
  FIXED_TERM_OSDA = 'fixed-term-osda',
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
    case BOND_TYPE.FIXED_EXPIRY_SDA:
    case BOND_TYPE.FIXED_EXPIRY_FPA:
    case BOND_TYPE.FIXED_EXPIRY_OFDA:
    case BOND_TYPE.FIXED_EXPIRY_OSDA:
    case BOND_TYPE.FIXED_EXPIRY_DEPRECATED:
      return FixedExpirationTeller__factory.connect(
        getAddresses(chainId).fixedExpiryTeller,
        providerOrSigner,
      );
    case BOND_TYPE.FIXED_TERM_SDA:
    case BOND_TYPE.FIXED_TERM_FPA:
    case BOND_TYPE.FIXED_TERM_OFDA:
    case BOND_TYPE.FIXED_TERM_OSDA:
    case BOND_TYPE.FIXED_TERM_DEPRECATED:
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
):
  | BondFixedExpCDA
  | BondFixedExpFPA
  | BondFixedExpOFDA
  | BondFixedExpOSDA
  | BondFixedTermCDA
  | BondFixedTermFPA
  | BondFixedTermOFDA
  | BondFixedTermOSDA {
  const factory = getAuctioneerFactoryForType(bondType);
  return factory.connect(
    getAddressesForType(chainId, bondType).auctioneer,
    providerOrSigner,
  );
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

export function getAuctioneerFactoryForType(bondType: BOND_TYPE) {
  switch (bondType) {
    case BOND_TYPE.FIXED_EXPIRY_SDA:
    case BOND_TYPE.FIXED_EXPIRY_DEPRECATED:
      return BondFixedExpCDA__factory;
    case BOND_TYPE.FIXED_EXPIRY_FPA:
      return BondFixedExpFPA__factory;
    case BOND_TYPE.FIXED_EXPIRY_OFDA:
      return BondFixedExpOFDA__factory;
    case BOND_TYPE.FIXED_EXPIRY_OSDA:
      return BondFixedExpOSDA__factory;
    case BOND_TYPE.FIXED_TERM_SDA:
    case BOND_TYPE.FIXED_TERM_DEPRECATED:
      return BondFixedTermCDA__factory;
    case BOND_TYPE.FIXED_TERM_FPA:
      return BondFixedTermFPA__factory;
    case BOND_TYPE.FIXED_TERM_OFDA:
      return BondFixedTermOFDA__factory;
    case BOND_TYPE.FIXED_TERM_OSDA:
      return BondFixedTermOSDA__factory;
  }
}

export function getAuctioneerFactoryForName(
  auctioneerName: string,
  auctioneerAddress: string,
  provider: Provider,
) {
  let factory;
  switch (auctioneerName) {
    case 'BondFixedExpCDA':
      factory = BondFixedExpCDA__factory;
      break;
    case 'BondFixedExpFPA':
      factory = BondFixedExpFPA__factory;
      break;
    case 'BondFixedExpOFDA':
      factory = BondFixedExpOFDA__factory;
      break;
    case 'BondFixedExpOSDA':
      factory = BondFixedExpOSDA__factory;
      break;
    case 'BondFixedTermCDA':
      factory = BondFixedTermCDA__factory;
      break;
    case 'BondFixedTermFPA':
      factory = BondFixedTermFPA__factory;
      break;
    case 'BondFixedTermOFDA':
      factory = BondFixedTermOFDA__factory;
      break;
    case 'BondFixedTermOSDA':
      factory = BondFixedTermOSDA__factory;
      break;
    default:
      throw Error(
        'Auctioneer Factory Not Found for ' +
          auctioneerName +
          ' ' +
          auctioneerAddress,
      );
  }

  return factory.connect(auctioneerAddress, provider);
}
