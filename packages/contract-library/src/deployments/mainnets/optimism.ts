import type { ContractAddresses } from "../..";
import type { Address } from "viem";
import { optimism } from "viem/chains";

const addresses: ContractAddresses = {
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

export default {
  chain: optimism,
  addresses: addresses,
  subgraphURL:
    "https://subgraph.satsuma-prod.com/8cad5c83fb09/spaces-team/bond-protocol-optimism/api",
  getRpcURL: (key?: string) => `https://opt-mainnet.g.alchemy.com/v2/${key}`,
};
