import { Chain } from "viem/chains";
import * as chains from "viem/chains";

function getChain(chainId: number | string): Chain {
  return Object.values(chains).find((c) => c.id === Number(chainId)) as Chain;
}

const getBlockExplorer = (
  chainId: string | number,
  subpath: "address" | "tx" | string = "address"
) => {
  const chain = getChain(chainId);
  const blockExplorer = chain?.blockExplorers?.default;

  return {
    url: `${blockExplorer?.url}/${subpath}/` ?? "",
    name: blockExplorer?.name ?? "",
  };
};

export { chains, getChain, getBlockExplorer };
export default chains;
