import * as abis from '../contracts';

export enum Auctioneers {
  BondFixedExpCDA = 'BondFixedExpCDA',
  BondFixedExpSDAv1_1 = 'BondFixedExpSDAv1_1',
  BondFixedExpFPA = 'BondFixedExpFPA',
  BondFixedExpOFDA = 'BondFixedExpOFDA',
  BondFixedExpOSDA = 'BondFixedExpOSDA',
  BondFixedTermCDA = 'BondFixedTermCDA',
  BondFixedTermSDAv1_1 = 'BondFixedTermSDAv1_1',
  BondFixedTermFPA = 'BondFixedTermFPA',
  BondFixedTermOFDA = 'BondFixedTermOFDA',
  BondFixedTermOSDA = 'BondFixedTermOSDA',
}

export const abiMap = {
  authority: abis.authorityABI,
  aggregator: abis.aggregatorABI,
  fixedExpiryTeller: abis.fixedExpiryTellerABI,
  fixedExpirySDAAuctioneer: abis.fixedExpirySdaAuctioneerABI,
  fixedExpirySDAv1_1Auctioneer: abis.fixedExpirySdAv1_1AuctioneerABI,
  fixedExpiryFPAAuctioneer: abis.fixedExpiryFpaAuctioneerABI,
  fixedExpiryOFDAAuctioneer: abis.fixedExpiryOfdaAuctioneerABI,
  fixedExpiryOSDAAuctioneer: abis.fixedExpiryOsdaAuctioneerABI,
  fixedTermTeller: abis.fixedTermTellerABI,
  fixedTermSDAAuctioneer: abis.fixedTermSdaAuctioneerABI,
  fixedTermSDAv1_1Auctioneer: abis.fixedTermSdAv1_1AuctioneerABI,
  fixedTermFPAAuctioneer: abis.fixedTermFpaAuctioneerABI,
  fixedTermOFDAAuctioneer: abis.fixedTermOfdaAuctioneerABI,
  fixedTermOSDAAuctioneer: abis.fixedTermOsdaAuctioneerABI,
};

export const auctioneerMap = {
  BondFixedExpCDA: abiMap.fixedExpirySDAAuctioneer,
  BondFixedExpSDAv1_1: abiMap.fixedExpirySDAv1_1Auctioneer,
  BondFixedExpFPA: abiMap.fixedExpiryFPAAuctioneer,
  BondFixedExpOFDA: abiMap.fixedExpiryOFDAAuctioneer,
  BondFixedExpOSDA: abiMap.fixedExpiryOSDAAuctioneer,
  BondFixedTermCDA: abiMap.fixedTermSDAAuctioneer,
  BondFixedTermSDAv1_1: abiMap.fixedTermSDAv1_1Auctioneer,
  BondFixedTermFPA: abiMap.fixedTermFPAAuctioneer,
  BondFixedTermOFDA: abiMap.fixedTermOFDAAuctioneer,
  BondFixedTermOSDA: abiMap.fixedTermOSDAAuctioneer,
};

export default abiMap;
