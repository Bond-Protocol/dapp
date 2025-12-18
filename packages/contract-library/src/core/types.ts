import { Address } from "viem";

export type ContractAddresses = {
  authority: Address;
  aggregator: Address;
  fixedExpiryTeller: Address;
  fixedExpirySDAAuctioneer: Address;
  fixedExpirySDAv1_1Auctioneer: Address;
  fixedExpiryFPAAuctioneer: Address;
  fixedExpiryOFDAAuctioneer: Address;
  fixedExpiryOSDAAuctioneer: Address;
  fixedTermTeller: Address;
  fixedTermSDAAuctioneer: Address;
  fixedTermSDAv1_1Auctioneer: Address;
  fixedTermFPAAuctioneer: Address;
  fixedTermOFDAAuctioneer: Address;
  fixedTermOSDAAuctioneer: Address;
  settlement: Address;
};

export type AddressesForType = {
  teller: Address;
  auctioneer: Address;
};

export type BaseMarketPricing = "dynamic" | "static";
export type OracleMarketPricing = "oracle-dynamic" | "oracle-static";
export type MarketPricing = BaseMarketPricing | OracleMarketPricing;
