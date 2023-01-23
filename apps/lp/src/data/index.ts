import { PROTOCOLS } from "@bond-protocol/bond-library";

const protocols = Array.from(PROTOCOLS.values()).filter(
  (p) => !p.links.twitter?.includes("bond_protocol") //remove our test protocols
);

const auditors = [
  { name: "Zellic", logoUrl: "/zellic.svg" },
  { name: "yAcademy", logoUrl: "/yacademy.png" },
];

const links = {
  audits: "https://github.com/Bond-Protocol/bond-contracts/tree/master/audits",
  docs: "https://docs.bondprotocol.finance",
  dapp: "https://app.bondprotocol.finance",
};

export default {
  links,
  protocols,
  auditors,
};
