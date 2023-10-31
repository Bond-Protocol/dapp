import aggregator from "../abis/protocol/IBondAggregator.json";
import baseAuctioneer from "../abis/protocol/IBondAuctioneer.json";
import authority from "../abis/protocol/authority.json";
import baseTeller from "../abis/protocol/IBondTeller.json";
import fixedExpirySDAAuctioneer from "../abis/protocol/BondFixedExpirySDA.json";
import fixedExpiryFPAAuctioneer from "../abis/protocol/BondFixedExpiryFPA.json";
import fixedExpiryOFDAAuctioneer from "../abis/protocol/BondFixedExpiryOFDA.json";
import fixedExpiryOSDAAuctioneer from "../abis/protocol/BondFixedExpiryOSDA.json";
import fixedExpirySDAv1_1Auctioneer from "../abis/protocol/BondFixedExpSDAv1_1.json";
import fixedTermSDAAuctioneer from "../abis/protocol/BondFixedTermSDA.json";
import fixedTermFPAAuctioneer from "../abis/protocol/BondFixedTermFPA.json";
import fixedTermOFDAAuctioneer from "../abis/protocol/BondFixedTermOFDA.json";
import fixedTermOSDAAuctioneer from "../abis/protocol/BondFixedTermOSDA.json";
import fixedTermSDAv1_1Auctioneer from "../abis/protocol/BondFixedTermSDAv1_1.json";
import fixedExpiryTeller from "../abis/protocol/IBondFixedExpiryTeller.json";
import fixedTermTeller from "../abis/protocol/IBondFixedTermTeller.json";
import erc20 from "../abis/protocol/IERC20.json";
import chainlinkOracle from "../abis/protocol/BondChainlinkOracle.json";

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
