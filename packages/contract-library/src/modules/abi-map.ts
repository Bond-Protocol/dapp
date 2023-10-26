import aggregator from '../abis/protocol/AggregatorV3Interface.json';
import authority from '../abis/protocol/Authority.json';
import baseTeller from '../abis/protocol/IBondTeller.json';
import fixedExpirySDAAuctioneer from '../abis/protocol/BondFixedExpirySDA.json';
import fixedExpiryFPAAuctioneer from '../abis/protocol/BondFixedExpiryFPA.json';
import fixedExpiryOFDAAuctioneer from '../abis/protocol/BondFixedExpiryOFDA.json';
import fixedExpiryOSDAAuctioneer from '../abis/protocol/BondFixedExpiryOSDA.json';
import fixedExpirySDAv1_1Auctioneer from '../abis/protocol/BondFixedExpSDAv1_1.json';
import fixedTermSDAAuctioneer from '../abis/protocol/BondFixedTermSDA.json';
import fixedTermFPAAuctioneer from '../abis/protocol/BondFixedTermFPA.json';
import fixedTermOFDAAuctioneer from '../abis/protocol/BondFixedTermOFDA.json';
import fixedTermOSDAAuctioneer from '../abis/protocol/BondFixedTermOSDA.json';
import fixedTermSDAv1_1Auctioneer from '../abis/protocol/BondFixedTermSDAv1_1.json';
import fixedExpiryTeller from '../abis/protocol/BondFixedExpiryTeller.json';
import fixedTermTeller from '../abis/protocol/BondFixedTermTeller.json';

export const abiMap = {
  authority,
  aggregator,
  baseTeller,
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
