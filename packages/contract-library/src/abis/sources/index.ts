import aggregator from "./IBondAggregator.json";
import baseAuctioneer from "./IBondAuctioneer.json";
import authority from "./authority.json";
import baseTeller from "./IBondTeller.json";
import fixedExpirySDAAuctioneer from "./BondFixedExpirySDA.json";
import fixedExpiryFPAAuctioneer from "./BondFixedExpiryFPA.json";
import fixedExpiryOFDAAuctioneer from "./BondFixedExpiryOFDA.json";
import fixedExpiryOSDAAuctioneer from "./BondFixedExpiryOSDA.json";
import fixedExpirySDAv1_1Auctioneer from "./BondFixedExpSDAv1_1.json";
import fixedTermSDAAuctioneer from "./BondFixedTermSDA.json";
import fixedTermFPAAuctioneer from "./BondFixedTermFPA.json";
import fixedTermOFDAAuctioneer from "./BondFixedTermOFDA.json";
import fixedTermOSDAAuctioneer from "./BondFixedTermOSDA.json";
import fixedTermSDAv1_1Auctioneer from "./BondFixedTermSDAv1_1.json";
import fixedExpiryTeller from "./IBondFixedExpiryTeller.json";
import fixedTermTeller from "./IBondFixedTermTeller.json";
import erc20 from "./MintableERC20.json";
import chainlinkOracle from "./BondChainlinkOracle.json";

export const abiMap = {
  authority,
  aggregator,
  baseTeller,
  baseAuctioneer,
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

  erc20,
  chainlinkOracle,
};
