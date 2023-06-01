import { useState } from "react";
import { IERC20__factory, Token } from "@bond-protocol/contract-library";
import defillama from "services/defillama";
import { providers } from "services/owned-providers";
import coingecko from "services/coingecko";

const fetchOnChain = async (
  address: string,
  chainId: number
): Promise<Omit<Token, "price">> => {
  const provider = providers[chainId];

  try {
    const contract = IERC20__factory.connect(address, provider);
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);

    return {
      address,
      chainId,
      name,
      symbol,
      decimals,
    };
  } catch (e) {
    console.log("Failed to fetch ERC20", e);
    return {} as Token;
  }
};

// const query = useQuery(
//   [`discover-${baseToken?.address}-${baseToken?.chainId}`],
//   () => discover(baseToken?.address as string, baseToken?.chainId as number),
//   { enabled: !!baseToken?.address && !!baseToken.chainId }
// );

export const useDiscoverToken = () => {
  const [isLoading, setLoading] = useState(false);

  const discover = async (address: string, chainId: number) => {
    setLoading(true);

    try {
      const [token] = await defillama.fetchPrice(address, chainId);
      //@ts-ignore
      if (token.price) {
        return { token, source: "defillama" };
      }

      const onChainToken = await fetchOnChain(address, chainId);
      if (onChainToken.decimals) {
        return { token: onChainToken, source: "on-chain" };
      }
    } catch (e) {
      console.error(
        `Failed to discover token ${address} on chain ${chainId}`,
        e
      );
      return { source: "", token: {} as Token };
    } finally {
      setLoading(false);
    }
  };

  const discoverLogo = async (token: Token) => {
    try {
      let { logoURI, name, details } = await coingecko.getTokenByContract(
        token.address,
        token.chainId
      );

      return { ...token, name, details, logoURI, logoUrl: logoURI };
    } catch (e) {
      console.log(`Failed to discover ${token.symbol} logo`);
      return token;
    }
  };

  return {
    discover,
    discoverLogo,
    isLoading,
  };
};
