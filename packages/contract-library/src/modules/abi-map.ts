import aggregator from '../abis/protocol/aggregator.json';
import authority from '../abis/protocol/authority.json';
import fixedExpirySDAAuctioneer from '../abis/protocol/BondFixedExpCDA.json';
import fixedExpiryFPAAuctioneer from '../abis/protocol/BondFixedExpFPA.json';
import fixedExpiryOFDAAuctioneer from '../abis/protocol/BondFixedExpOFDA.json';
import fixedExpiryOSDAAuctioneer from '../abis/protocol/BondFixedExpOSDA.json';
import fixedExpirySDAv1_1Auctioneer from '../abis/protocol/BondFixedExpSDAv1_1.json';
import fixedTermSDAAuctioneer from '../abis/protocol/BondFixedTermCDA.json';
import fixedTermFPAAuctioneer from '../abis/protocol/BondFixedTermFPA.json';
import fixedTermOFDAAuctioneer from '../abis/protocol/BondFixedTermOFDA.json';
import fixedTermOSDAAuctioneer from '../abis/protocol/BondFixedTermOSDA.json';
import fixedTermSDAv1_1Auctioneer from '../abis/protocol/BondFixedTermSDAv1_1.json';
import fixedExpiryTeller from '../abis/protocol/fixed-expiration-teller.json';
import fixedTermTeller from '../abis/protocol/fixed-term-teller.json';

import { ContractAddresses } from './address-provider';

export const abiMap: Record<keyof ContractAddresses, any> = {
  authority,
  aggregator,
  fixedExpiryTeller,
  fixedExpirySDAAuctioneer,
  fixedExpirySDAv1_1Auctioneer,
  fixedExpiryFPAAuctioneer,
  fixedExpiryOFDAAuctioneer,
  fixedExpiryOSDAAuctioneer,
  fixedTermTeller,
  fixedTermSDAAuctioneer,
  fixedTermSDAv1_1Auctioneer,
  fixedTermFPAAuctioneer,
  fixedTermOFDAAuctioneer,
  fixedTermOSDAAuctioneer,
};
