import type { ContractAddresses } from "../..";
import type { Address } from "viem";
import { mainnet } from "viem/chains";

const addresses: ContractAddresses = {
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

export default {
  chain: mainnet,
  addresses: addresses,
  subgraphURL:
    "https://api.goldsky.com/api/public/project_cmgzjlmla004j5np2cgyz7il6/subgraphs/bond-protocol-ethereum/v0.0.3/gn",
  getRpcURL: (key?: string) => `https://eth-mainnet.g.alchemy.com/v2/${key}`,
};
