import { Address } from "viem";
import { auctioneerAddressesByType } from "./enums";
import type { BondType } from "@bond-protocol/types";

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

export const getMarketTypeByAuctioneer = (address: string): MarketPricing => {
  switch (address.toLowerCase()) {
    case arbitrumMainnetAddresses.fixedExpiryFPAAuctioneer.toLowerCase():
    case arbitrumMainnetAddresses.fixedTermFPAAuctioneer.toLowerCase():
      return "static";

    case arbitrumMainnetAddresses.fixedExpiryOFDAAuctioneer.toLowerCase():
    case arbitrumMainnetAddresses.fixedTermOFDAAuctioneer.toLowerCase():
      return "oracle-static";

    case arbitrumMainnetAddresses.fixedExpiryOSDAAuctioneer.toLowerCase():
    case arbitrumMainnetAddresses.fixedTermOSDAAuctioneer.toLowerCase():
      return "oracle-dynamic";

    case arbitrumMainnetAddresses.fixedExpirySDAAuctioneer.toLowerCase():
    case arbitrumMainnetAddresses.fixedTermSDAAuctioneer.toLowerCase():
    default:
      return "dynamic";
  }
};
const mainnetAddresses: ContractAddresses = {
  authority: "0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14",
  aggregator: "0x007A66A2a13415DB3613C1a4dd1C942A285902d1",
  fixedExpiryTeller: "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95",
  fixedExpirySDAAuctioneer: "0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD",
  fixedExpirySDAv1_1Auctioneer: "" as Address,
  fixedExpiryFPAAuctioneer: "0xFEF9A527ac84836DC9939Ad75eb8ce325bBE0E54",
  fixedExpiryOFDAAuctioneer: "" as Address,
  fixedExpiryOSDAAuctioneer: "" as Address,
  fixedTermTeller: "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6",
  fixedTermSDAAuctioneer: "0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222",
  fixedTermSDAv1_1Auctioneer: "" as Address,
  fixedTermFPAAuctioneer: "0xF7F9Ae2415F8Cb89BEebf9662A19f2393e7065e0",
  fixedTermOFDAAuctioneer: "" as Address,
  fixedTermOSDAAuctioneer: "" as Address,
  settlement: "0x007105D27BCe31CcFFA76Fc191886e944606E34a",
};

const goerliAddresses: ContractAddresses = {
  authority: "0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14",
  aggregator: "0x007A66A2a13415DB3613C1a4dd1C942A285902d1",
  fixedExpiryTeller: "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95",
  fixedExpirySDAAuctioneer: "0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD",
  fixedExpirySDAv1_1Auctioneer: "0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646",
  fixedExpiryFPAAuctioneer: "0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55",
  fixedExpiryOFDAAuctioneer: "0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6",
  fixedExpiryOSDAAuctioneer: "0xFE05DA9fffc72027C26E2327A9e6339670CD1b90",
  fixedTermTeller: "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6",
  fixedTermSDAAuctioneer: "0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222",
  fixedTermSDAv1_1Auctioneer: "0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F",
  fixedTermFPAAuctioneer: "0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1",
  fixedTermOFDAAuctioneer: "0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd",
  fixedTermOSDAAuctioneer: "0xF705DA9476a172408e1B94b2A7B2eF595A91C29b",
  settlement: "0x007105D27BCe31CcFFA76Fc191886e944606E34a",
};

const arbitrumMainnetAddresses: ContractAddresses = {
  authority: "0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14",
  aggregator: "0x007A66A2a13415DB3613C1a4dd1C942A285902d1",
  fixedExpiryTeller: "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95",
  fixedExpirySDAAuctioneer: "0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD",
  fixedExpirySDAv1_1Auctioneer: "0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646",
  fixedExpiryFPAAuctioneer: "0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55",
  fixedExpiryOFDAAuctioneer: "0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6",
  fixedExpiryOSDAAuctioneer: "0xFE05DA9fffc72027C26E2327A9e6339670CD1b90",
  fixedTermTeller: "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6",
  fixedTermSDAAuctioneer: "0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222",
  fixedTermSDAv1_1Auctioneer: "0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F",
  fixedTermFPAAuctioneer: "0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1",
  fixedTermOFDAAuctioneer: "0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd",
  fixedTermOSDAAuctioneer: "0xF705DA9476a172408e1B94b2A7B2eF595A91C29b",
  settlement: "0x007105D27BCe31CcFFA76Fc191886e944606E34a",
};

const arbitrumGoerliAddresses: ContractAddresses = {
  authority: "0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14",
  aggregator: "0x007A66A2a13415DB3613C1a4dd1C942A285902d1",
  fixedExpiryTeller: "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95",
  fixedExpirySDAAuctioneer: "0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD",
  fixedExpirySDAv1_1Auctioneer: "0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646",
  fixedExpiryFPAAuctioneer: "0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55",
  fixedExpiryOFDAAuctioneer: "0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6",
  fixedExpiryOSDAAuctioneer: "0xFE05DA9fffc72027C26E2327A9e6339670CD1b90",
  fixedTermTeller: "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6",
  fixedTermSDAAuctioneer: "0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222",
  fixedTermSDAv1_1Auctioneer: "0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F",
  fixedTermFPAAuctioneer: "0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1",
  fixedTermOFDAAuctioneer: "0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd",
  fixedTermOSDAAuctioneer: "0xF705DA9476a172408e1B94b2A7B2eF595A91C29b",
  settlement: "0x007105D27BCe31CcFFA76Fc191886e944606E34a",
};

const optimismMainnetAddresses: ContractAddresses = {
  authority: "0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14",
  aggregator: "0x007A66A2a13415DB3613C1a4dd1C942A285902d1",
  fixedExpiryTeller: "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95",
  fixedExpirySDAAuctioneer: "" as Address,
  fixedExpirySDAv1_1Auctioneer: "0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646",
  fixedExpiryFPAAuctioneer: "0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55",
  fixedExpiryOFDAAuctioneer: "0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6",
  fixedExpiryOSDAAuctioneer: "0xFE05DA9fffc72027C26E2327A9e6339670CD1b90",
  fixedTermTeller: "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6",
  fixedTermSDAAuctioneer: "" as Address,
  fixedTermSDAv1_1Auctioneer: "0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F",
  fixedTermFPAAuctioneer: "0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1",
  fixedTermOFDAAuctioneer: "0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd",
  fixedTermOSDAAuctioneer: "0xF705DA9476a172408e1B94b2A7B2eF595A91C29b",
  settlement: "" as Address,
};

const optimismGoerliAddresses: ContractAddresses = {
  authority: "0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14",
  aggregator: "0x007A66A2a13415DB3613C1a4dd1C942A285902d1",
  fixedExpiryTeller: "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95",
  fixedExpirySDAAuctioneer: "0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD",
  fixedExpirySDAv1_1Auctioneer: "0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646",
  fixedExpiryFPAAuctioneer: "0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55",
  fixedExpiryOFDAAuctioneer: "0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6",
  fixedExpiryOSDAAuctioneer: "0xFE05DA9fffc72027C26E2327A9e6339670CD1b90",
  fixedTermTeller: "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6",
  fixedTermSDAAuctioneer: "0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222",
  fixedTermSDAv1_1Auctioneer: "0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F",
  fixedTermFPAAuctioneer: "0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1",
  fixedTermOFDAAuctioneer: "0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd",
  fixedTermOSDAAuctioneer: "0xF705DA9476a172408e1B94b2A7B2eF595A91C29b",
  settlement: "" as Address,
};

const addressesByChainId: Record<number, Partial<ContractAddresses>> = {
  1: mainnetAddresses as ContractAddresses,
  5: goerliAddresses,
  42161: arbitrumMainnetAddresses,
  421613: arbitrumGoerliAddresses,
  10: optimismMainnetAddresses as ContractAddresses,
  420: optimismGoerliAddresses,
};

export const getAddresses = (chainId: number) => {
  return addressesByChainId[chainId] ?? mainnetAddresses;
};

export function getAuctioneerByBondType(
  chainId: number,
  type: BondType
): Address {
  const addresses = getAddresses(chainId);
  const name = auctioneerAddressesByType[type];

  const address = addresses[name];

  if (!address)
    throw new Error(
      `Unable to find Auctioneer address for bondtype: ${type} on chain ${chainId}`
    );

  return address;
}
