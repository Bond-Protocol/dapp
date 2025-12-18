import type { ContractAddresses } from "../..";
import type { Address } from "viem";
import { sonic } from "../../chains";

const addresses: ContractAddresses = {
  authority: "0x007A0F3b90c97ab8c5eE7f3b142204Ad819edB3A",
  aggregator: "0x007A66b5358D0e2a07C0eE078908517d186c1108",
  fixedExpiryTeller: "" as Address,
  fixedExpirySDAAuctioneer: "" as Address,
  fixedExpirySDAv1_1Auctioneer: "" as Address,
  fixedExpiryFPAAuctioneer: "" as Address,
  fixedExpiryOFDAAuctioneer: "" as Address,
  fixedExpiryOSDAAuctioneer: "" as Address,
  fixedTermTeller: "0x007F774351e541b8bc720018De0796c4BF5afE3D",
  fixedTermSDAAuctioneer:
    "0xF75DA1E6eA0521da0cb938D2F96bfe1Da5929557" as Address,
  fixedTermSDAv1_1Auctioneer: "0xF75DA1E6eA0521da0cb938D2F96bfe1Da5929557",
  fixedTermFPAAuctioneer: "0xF7F9A834CBD3075D4810A9b818f594312C0de168",
  fixedTermOFDAAuctioneer: "" as Address,
  fixedTermOSDAAuctioneer: "" as Address,
  settlement: "0x007102170E678984738f687E5b70F89Ad7ACa85e",
};

export default {
  chain: sonic,
  addresses: addresses,
  subgraphURL:
    "https://gateway.thegraph.com/api/subgraphs/id/44bPCgvSEQVe1aFzxXYMMgdUFyhRk7FxnSD5C6VmJV1D",
  getRpcURL: (key?: string) => `https://sonic-mainnet.g.alchemy.com/v2/${key}`,
};
