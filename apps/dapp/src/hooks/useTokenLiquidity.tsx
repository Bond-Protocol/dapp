import { useQuery } from "@tanstack/react-query";
import { getLiquidity } from "services/dexscreener";

export const useTokenLiquidity = ({
  address,
  chainId,
}: {
  address: string;
  chainId: number;
}) => {
  const query = useQuery({
    queryKey: [chainId, address],
    queryFn: () => getLiquidity({ chainId, address }),
    enabled: !!chainId && !!address,
  });

  return query;
};
