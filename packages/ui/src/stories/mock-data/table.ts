import logo from "../../assets/icon-logo.png";

const sample = {
  bond: {
    icon: logo,
    pairIcon: logo,
    value: "OHM-DAI",
    even: true,
  },
  price: {
    icon: logo,
    value: "$0.0194",
    subtext: "$0.0204 Market",
  },
  discount: { value: "33%" },
  maxPayout: { value: "7,333.33", sortValue: "7333.33", subtext: "$92,457.48" },
  vesting: { value: "04-20-2577", sortValue: "3", subtext: "Expiry" },
  creationDate: { value: "04-20-2022", sortValue: "1" },
  tbv: { value: "$3,333,333" },
  issuer: { icon: logo, value: "Bond Protocol" },
  view: {
    value: "View",
    onClick: (v: string) => console.log(v),
  },
};

const sample2 = {
  bond: {
    icon: logo,
    pairIcon: logo,
    value: "OHM-DAI",
  },
  price: {
    icon: logo,
    value: "$0.0174",
    subtext: "$0.0204 Market",
  },
  discount: { value: "-33%" },
  maxPayout: { value: "3,333.33", sortValue: "3333.33", subtext: "$11,457.48" },
  vesting: { value: "01-20-2577", sortValue: "2", subtext: "Expiry" },
  creationDate: { value: "04-20-2042", sortValue: "3" },
  tbv: { value: "$13,333,333" },
  issuer: { icon: logo, value: "Aphex Protocol" },
  view: {
    value: "View",
    onClick: (v: string) => console.log(v),
  },
};

const sample3 = {
  bond: {
    icon: logo,
    pairIcon: logo,
    value: "OHM-DAI",
    even: true,
  },
  price: {
    icon: logo,
    value: "$1.0194",
    subtext: "$0.0204 Market",
  },
  discount: { value: "3%" },
  maxPayout: { value: "333.33", sortValue: "333.33", subtext: "$15,457.48" },
  vesting: { value: "01-01-2577", sortValue: "1", subtext: "Expiry" },
  creationDate: { value: "02-20-2032", sortValue: "2" },
  tbv: { value: "$33,333,333" },
  issuer: { icon: logo, value: "Rug Protocol" },
  view: {
    value: "View",
    onClick: (v: string) => console.log(v),
  },
};

export const data = [sample, sample2, sample3];
