import type { ContractAddresses } from "../..";
import type { Address } from "viem";
import { base } from "viem/chains";

const addresses: ContractAddresses = {
  authority: "0x007A2F0A16bd0874CA2e1FFfAfc2d6B0b876aA8E",
  aggregator: "0x007A6621A9997A633Cb1B757f2f7ffb51310704A",
  fixedExpiryTeller: "0x007FE7c977a584CC54269730d210D889a86Ff9Cf",
  fixedExpirySDAAuctioneer: "0xFE5DA8cF974EaC29606EDce195BF7fAbfC570f1C",
  fixedExpirySDAv1_1Auctioneer: "0xFE5DA8cF974EaC29606EDce195BF7fAbfC570f1C",
  fixedExpiryFPAAuctioneer: "0xFEF9A1BB7c9AFd5F31c58Cf87Cefc639bDfA04Dd",
  fixedExpiryOFDAAuctioneer: "" as Address,
  fixedExpiryOSDAAuctioneer: "" as Address,
  fixedTermTeller: "0x007F774351e541b8bc720018De0796c4BF5afE3D",
  fixedTermSDAAuctioneer: "0xF75DA1E6eA0521da0cb938D2F96bfe1Da5929557",
  fixedTermSDAv1_1Auctioneer: "0xF75DA1E6eA0521da0cb938D2F96bfe1Da5929557",
  fixedTermFPAAuctioneer: "0xF7F9A834CBD3075D4810A9b818f594312C0de168",
  fixedTermOFDAAuctioneer: "" as Address,
  fixedTermOSDAAuctioneer: "" as Address,
  settlement: "0x007102170E678984738f687E5b70F89Ad7ACa85e",
};

export default {
  chain: base,
  addresses: addresses,
  subgraphURL:
    "https://api.goldsky.com/api/public/project_cmgzjlmla004j5np2cgyz7il6/subgraphs/bond-protocol-base/v0.0.3/gn",
  getRpcURL: (key?: string) => `https://base-mainnet.g.alchemy.com/v2/${key}`,
};
