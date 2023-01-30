import { PROTOCOLS } from "@bond-protocol/bond-library";

const protocols = Array.from(PROTOCOLS.values()).filter(
  (p) => !p.links.twitter?.includes("bond_protocol") //remove our test protocols
);

const auditors = [
  {
    name: "Sherlock",
    logoUrl: "/external/sherlock.svg",
    url: "https://www.sherlock.xyz/",
  },
  {
    name: "yAcademy",
    logoUrl: "/external/yacademy.png",
    url: "https://yacademy.dev/",
  },
  {
    name: "Zellic",
    logoUrl: "/external/zellic.svg",
    url: "https://www.zellic.io/",
  },
];

const bounties = [{ name: "ImmuneFi", logoUrl: "/external/immunefi.svg" }];

const links = {
  audits: "https://github.com/Bond-Protocol/bond-contracts/tree/master/audits",
  docs: "https://docs.bondprotocol.finance",
  dapp: "https://app.bondprotocol.finance",
  verify:
    "https://docs.bondprotocol.finance/bond-marketplace/market-verification",
  whyBond:
    "https://docs.bondprotocol.finance/basics/bonding#what-are-the-benefits-of-bonding",
};

export default {
  links,
  protocols,
  auditors,
  bounties,
};
