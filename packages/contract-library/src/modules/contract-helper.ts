import { Provider } from '@ethersproject/providers';
import { Abi, PublicClient, WalletClient, getContract } from 'viem';
import { BigNumberish, Signer } from 'ethers';
import {
  getAddresses,
  getAddressesForType,
  getAddressesV2,
} from './address-provider';
import * as contracts from '../contracts';

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
  BondFixedExpSDAv1_1,
  BondFixedExpSDAv1_1__factory,
  BondFixedTermCDA,
  BondFixedTermCDA__factory,
  BondFixedTermFPA,
  BondFixedTermFPA__factory,
  BondFixedTermOFDA,
  BondFixedTermOFDA__factory,
  BondFixedTermOSDA,
  BondFixedTermOSDA__factory,
  BondFixedTermSDAv1_1,
  BondFixedTermSDAv1_1__factory,
  BondTeller,
  BondTeller__factory,
  FixedExpirationTeller,
  FixedExpirationTeller__factory,
  FixedTermTeller,
  FixedTermTeller__factory,
} from 'types';
import { abiMap as Abis } from './abi-map';

import bftofda from '../abis/protocol/BondFixedTermOFDA.json';
import { aggregatorABI } from '../contracts';

export enum BOND_TYPE {
  FIXED_EXPIRY_DEPRECATED = 'fixed-expiration',
  FIXED_EXPIRY_SDA = 'fixed-expiry-sda',
  FIXED_EXPIRY_SDA_V1_1 = 'fixed-expiry-sda-v1_1',
  FIXED_EXPIRY_FPA = 'fixed-expiry-fpa',
  FIXED_EXPIRY_OFDA = 'fixed-expiry-ofda',
  FIXED_EXPIRY_OSDA = 'fixed-expiry-osda',
  FIXED_TERM_DEPRECATED = 'fixed-term',
  FIXED_TERM_SDA = 'fixed-term-sda',
  FIXED_TERM_SDA_V1_1 = 'fixed-term-sda-v1_1',
  FIXED_TERM_FPA = 'fixed-term-fpa',
  FIXED_TERM_OFDA = 'fixed-term-ofda',
  FIXED_TERM_OSDA = 'fixed-term-osda',
}

export const getChainId = async (
  providerOrSigner: Provider | Signer,
): Promise<string> => {
  if (!providerOrSigner) return '';
  let chainId;
  if (providerOrSigner instanceof Provider) {
    const network = await providerOrSigner.getNetwork();
    chainId = network.chainId;
  } else {
    chainId = await providerOrSigner.getChainId();
  }

  return chainId.toString();
};

export function getChainIdV2(client: PublicClient | WalletClient) {
  const chainId = client.chain?.id;
  if (!chainId) throw new Error('Unable to get Chain Id from client');
  return chainId;
}

export async function getAggregator(
  providerOrSigner: Provider | Signer,
): Promise<Aggregator> {
  const chainId = await getChainId(providerOrSigner);
  return Aggregator__factory.connect(
    getAddresses(chainId).aggregator,
    providerOrSigner,
  );
}

export async function getAggregatorV2(publicClient: PublicClient) {
  const chainId = getChainIdV2(publicClient);
  const address = getAddressesV2(chainId).aggregator;
  const contract = getContract({ address, abi: aggregatorABI, publicClient });
}

export async function getAuthority(
  providerOrSigner: Provider | Signer,
): Promise<Authority> {
  const chainId = await getChainId(providerOrSigner);
  return Authority__factory.connect(
    getAddresses(chainId).authority,
    providerOrSigner,
  );
}

export function getBaseBondTeller(
  providerOrSigner: Provider | Signer,
  address: string,
): BondTeller {
  return BondTeller__factory.connect(address, providerOrSigner);
}

export async function getTellerContract(
  providerOrSigner: Provider | Signer,
  bondType: BOND_TYPE,
): Promise<FixedExpirationTeller | FixedTermTeller> {
  const chainId = await getChainId(providerOrSigner);
  switch (bondType) {
    case BOND_TYPE.FIXED_EXPIRY_SDA:
    case BOND_TYPE.FIXED_EXPIRY_SDA_V1_1:
    case BOND_TYPE.FIXED_EXPIRY_FPA:
    case BOND_TYPE.FIXED_EXPIRY_OFDA:
    case BOND_TYPE.FIXED_EXPIRY_OSDA:
    case BOND_TYPE.FIXED_EXPIRY_DEPRECATED:
      return FixedExpirationTeller__factory.connect(
        getAddresses(chainId).fixedExpiryTeller,
        providerOrSigner,
      );
    case BOND_TYPE.FIXED_TERM_SDA:
    case BOND_TYPE.FIXED_TERM_SDA_V1_1:
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

export async function getAuctioneerForCreate(
  providerOrSigner: Provider | Signer,
  bondType: BOND_TYPE,
): Promise<
  | BondFixedExpCDA
  | BondFixedExpSDAv1_1
  | BondFixedExpFPA
  | BondFixedExpOFDA
  | BondFixedExpOSDA
  | BondFixedTermCDA
  | BondFixedTermSDAv1_1
  | BondFixedTermFPA
  | BondFixedTermOFDA
  | BondFixedTermOSDA
> {
  const chainId = await getChainId(providerOrSigner);

  const factory = getAuctioneerFactoryForType(bondType);
  return factory.connect(
    getAddressesForType(chainId, bondType).auctioneer,
    providerOrSigner,
  );
}

export async function getAuctioneerFromAggregator(
  marketId: BigNumberish,
  providerOrSigner: Signer | Provider,
): Promise<Auctioneer> {
  const aggregator = await getAggregator(providerOrSigner);
  const auctioneerAddress = await aggregator.getAuctioneer(marketId, {});
  return Auctioneer__factory.connect(auctioneerAddress, providerOrSigner);
}

export function getAuctioneerFactoryForType(bondType: BOND_TYPE) {
  switch (bondType) {
    case BOND_TYPE.FIXED_EXPIRY_SDA:
    case BOND_TYPE.FIXED_EXPIRY_DEPRECATED:
      return BondFixedExpCDA__factory;
    case BOND_TYPE.FIXED_EXPIRY_SDA_V1_1:
      return BondFixedExpSDAv1_1__factory;
    case BOND_TYPE.FIXED_EXPIRY_FPA:
      return BondFixedExpFPA__factory;
    case BOND_TYPE.FIXED_EXPIRY_OFDA:
      return BondFixedExpOFDA__factory;
    case BOND_TYPE.FIXED_EXPIRY_OSDA:
      return BondFixedExpOSDA__factory;
    case BOND_TYPE.FIXED_TERM_SDA:
    case BOND_TYPE.FIXED_TERM_DEPRECATED:
      return BondFixedTermCDA__factory;
    case BOND_TYPE.FIXED_TERM_SDA_V1_1:
      return BondFixedTermSDAv1_1__factory;
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
      factory = contracts.getFixedExpirySdaAuctioneer;
      break;
    case 'BondFixedExpSDAv1_1':
      factory = contracts.getFixedExpirySdAv1_1Auctioneer;
      break;
    case 'BondFixedExpFPA':
      factory = contracts.getFixedExpiryFpaAuctioneer;
      break;
    case 'BondFixedExpOFDA':
      factory = contracts.getFixedExpiryOfdaAuctioneer;
      break;
    case 'BondFixedExpOSDA':
      factory = contracts.getFixedExpiryOfdaAuctioneer;
      break;
    case 'BondFixedTermCDA':
      factory = contracts.getFixedTermSdaAuctioneer;
      break;
    case 'BondFixedTermSDAv1_1':
      factory = contracts.getFixedExpirySdAv1_1Auctioneer;
      break;
    case 'BondFixedTermFPA':
      factory = contracts.getFixedTermFpaAuctioneer;
      break;
    case 'BondFixedTermOFDA':
      factory = contracts.getFixedTermOfdaAuctioneer;
      break;
    case 'BondFixedTermOSDA':
      factory = contracts.getFixedTermOsdaAuctioneer;
      break;
    default:
      throw Error(
        'Auctioneer Factory Not Found for ' +
          auctioneerName +
          ' ' +
          auctioneerAddress,
      );
  }

  return factory({address: auctioneerAddress, client:});
}
