import * as abiFiles from "./generated";

export const abis = {
  authority: abiFiles.authorityABI,
  aggregator: abiFiles.aggregatorABI,
  baseAuctioneer: abiFiles.baseAuctioneerABI,
  baseTeller: abiFiles.baseTellerABI,
  fixedExpiryTeller: abiFiles.fixedExpiryTellerABI,
  fixedExpirySDAAuctioneer: abiFiles.fixedExpirySdaAuctioneerABI,
  fixedExpirySDAv1_1Auctioneer: abiFiles.fixedExpirySdAv1_1AuctioneerABI,
  fixedExpiryFPAAuctioneer: abiFiles.fixedExpiryFpaAuctioneerABI,
  fixedExpiryOFDAAuctioneer: abiFiles.fixedExpiryOfdaAuctioneerABI,
  fixedExpiryOSDAAuctioneer: abiFiles.fixedExpiryOsdaAuctioneerABI,
  fixedTermTeller: abiFiles.fixedTermTellerABI,
  fixedTermSDAAuctioneer: abiFiles.fixedTermSdaAuctioneerABI,
  fixedTermSDAv1_1Auctioneer: abiFiles.fixedTermSdAv1_1AuctioneerABI,
  fixedTermFPAAuctioneer: abiFiles.fixedTermFpaAuctioneerABI,
  fixedTermOFDAAuctioneer: abiFiles.fixedTermOfdaAuctioneerABI,
  fixedTermOSDAAuctioneer: abiFiles.fixedTermOsdaAuctioneerABI,

  erc20: abiFiles.erc20ABI,
  chainlinkOracle: abiFiles.chainlinkOracleABI,
};

export const auctioneerAbis = {
  BondFixedExpCDA: abis.fixedExpirySDAAuctioneer,
  BondFixedExpSDAv1_1: abis.fixedExpirySDAv1_1Auctioneer,
  BondFixedExpFPA: abis.fixedExpiryFPAAuctioneer,
  BondFixedExpOFDA: abis.fixedExpiryOFDAAuctioneer,
  BondFixedExpOSDA: abis.fixedExpiryOSDAAuctioneer,
  BondFixedTermCDA: abis.fixedTermSDAAuctioneer,
  BondFixedTermSDAv1_1: abis.fixedTermSDAv1_1Auctioneer,
  BondFixedTermFPA: abis.fixedTermFPAAuctioneer,
  BondFixedTermOFDA: abis.fixedTermOFDAAuctioneer,
  BondFixedTermOSDA: abis.fixedTermOSDAAuctioneer,
};

export default abis;
