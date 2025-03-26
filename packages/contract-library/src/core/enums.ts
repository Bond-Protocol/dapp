import { abis } from "../abis";
import { ContractAddresses } from "./address-provider";
import { BondType } from "@bond-protocol/types";

export enum Auctioneer {
  BondFixedExpCDA = "BondFixedExpCDA",
  BondFixedExpSDAv1_1 = "BondFixedExpSDAv1_1",
  BondFixedExpFPA = "BondFixedExpFPA",
  BondFixedExpOFDA = "BondFixedExpOFDA",
  BondFixedExpOSDA = "BondFixedExpOSDA",
  BondFixedTermCDA = "BondFixedTermCDA",
  BondFixedTermSDAv1_1 = "BondFixedTermSDAv1_1",
  BondFixedTermFPA = "BondFixedTermFPA",
  BondFixedTermOFDA = "BondFixedTermOFDA",
  BondFixedTermOSDA = "BondFixedTermOSDA",
}

export const auctioneerAddressesByType: Record<
  BondType,
  keyof ContractAddresses
> = {
  [BondType.FIXED_EXPIRY_SDA]: "fixedExpirySDAAuctioneer",
  [BondType.FIXED_EXPIRY_DEPRECATED]: "fixedExpirySDAAuctioneer",
  [BondType.FIXED_EXPIRY_SDA_V1_1]: "fixedExpirySDAv1_1Auctioneer",
  [BondType.FIXED_EXPIRY_FPA]: "fixedExpiryFPAAuctioneer",
  [BondType.FIXED_EXPIRY_OFDA]: "fixedExpiryOFDAAuctioneer",
  [BondType.FIXED_EXPIRY_OSDA]: "fixedExpiryOSDAAuctioneer",
  [BondType.FIXED_TERM_SDA]: "fixedTermSDAAuctioneer",
  [BondType.FIXED_TERM_DEPRECATED]: "fixedTermSDAAuctioneer",
  [BondType.FIXED_TERM_SDA_V1_1]: "fixedTermSDAv1_1Auctioneer",
  [BondType.FIXED_TERM_FPA]: "fixedTermFPAAuctioneer",
  [BondType.FIXED_TERM_OFDA]: "fixedTermOFDAAuctioneer",
  [BondType.FIXED_TERM_OSDA]: "fixedTermOSDAAuctioneer",
};

export const auctioneersByType = {
  [BondType.FIXED_EXPIRY_SDA]: abis.fixedExpirySDAAuctioneer,
  [BondType.FIXED_EXPIRY_DEPRECATED]: abis.fixedExpirySDAAuctioneer,
  [BondType.FIXED_EXPIRY_SDA_V1_1]: abis.fixedExpirySDAv1_1Auctioneer,
  [BondType.FIXED_EXPIRY_FPA]: abis.fixedExpiryFPAAuctioneer,
  [BondType.FIXED_EXPIRY_OFDA]: abis.fixedExpiryOFDAAuctioneer,
  [BondType.FIXED_EXPIRY_OSDA]: abis.fixedExpiryOSDAAuctioneer,
  [BondType.FIXED_TERM_SDA]: abis.fixedTermSDAAuctioneer,
  [BondType.FIXED_TERM_DEPRECATED]: abis.fixedTermSDAAuctioneer,
  [BondType.FIXED_TERM_SDA_V1_1]: abis.fixedTermSDAv1_1Auctioneer,
  [BondType.FIXED_TERM_FPA]: abis.fixedTermFPAAuctioneer,
  [BondType.FIXED_TERM_OFDA]: abis.fixedTermOFDAAuctioneer,
  [BondType.FIXED_TERM_OSDA]: abis.fixedTermOSDAAuctioneer,
};
