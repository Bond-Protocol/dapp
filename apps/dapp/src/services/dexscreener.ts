import { generateFetcher } from "./custom-queries";

const endpoint = "https://api.dexscreener.com/latest/dex";

const chains: Record<number, string> = {
  1: "ethereum",
  42161: "arbitrum",
  10: "optimism",
  5: "ethereum",
  421613: "arbitrum",
  420: "optimism",
};

export const getLiquidity = async ({
  chainId,
  address,
}: {
  chainId: number;
  address: string;
}) => {
  const response = await generateFetcher(`${endpoint}/tokens/${address}`)();

  if (response?.pairs?.length) {
    return response.pairs
      .filter((p: any) => p.chainId === chains[chainId])
      .reduce(
        (total: any, p: any) => {
          total.liquidityUSD += p.liquidity?.usd ?? 0;
          return total;
        },
        { liquidityUSD: 0 }
      );
  }

  return { liquidityUSD: 0 };
};
