import arbitrum from "./arbitrum";
import mainnet from "./mainnet";
import optimism from "./optimism";
import base from "./base";
import polygon from "./polygon";
import sonic from "./sonic";
import bsc from "./bsc";

export const mainnetDeployments = [
  arbitrum,
  mainnet,
  optimism,
  base,
  polygon,
  sonic,
  bsc,
];

export * as arbitrumDeployment from "./arbitrum";
