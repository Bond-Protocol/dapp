import { mainnetDeployments } from "./mainnets";
import { testnetDeployments } from "./testnets";

export const deployments = [...mainnetDeployments, ...testnetDeployments];

export const deploymentRecord = deployments.reduce((acc, ele) => {
  return { ...acc, [ele.chain.id]: ele };
}, {});
