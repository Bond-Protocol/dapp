import { Chain } from "viem/chains";
import * as viemChains from "viem/chains";
import customChains from "../chains";

const chains = [...Object.values(viemChains), ...customChains];

function getChain(chainId: number | string): Chain {
  return chains.find((c) => c.id === Number(chainId)) as Chain;
}

const getBlockExplorer = (
  chainId: string | number,
  subpath: "address" | "tx" | string = "address"
) => {
  const chain = getChain(chainId);
  const blockExplorer = chain?.blockExplorers?.default;

  return {
    url: `${blockExplorer?.url}/${subpath}/`,
    name: blockExplorer?.name ?? "",
  };
};

export { chains, getChain, getBlockExplorer };
export default chains;
