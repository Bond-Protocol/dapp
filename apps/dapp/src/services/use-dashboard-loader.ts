import { getSubgraphQueries, providers } from "services";
import {
  BondPurchase,
  BondToken,
  Market,
  OwnerBalance,
  useGetDashboardDataQuery,
} from "../generated/graphql";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { useTestnetMode } from "hooks/useTestnet";
import { useEffect, useState } from "react";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { CalculatedMarket, getBalance } from "@bond-protocol/contract-library";
import { BigNumberish } from "ethers";
import { useCalculatedMarkets } from "hooks/useCalculatedMarkets";
import { useAccount } from "wagmi";

const currentTime = Math.trunc(Date.now() / 1000);

export const useDashboardLoader = () => {
  const { address } = useAccount();
  const { allMarkets } = useCalculatedMarkets();

  const dashboardData = getSubgraphQueries(useGetDashboardDataQuery, {
    address: address,
    currentTime: currentTime,
  });
  const { isLoading } = useSubgraphLoadingCheck(dashboardData);

  const [isTestnet] = useTestnetMode();
  const [ownerBalances, setOwnerBalances] = useState<OwnerBalance[]>([]);
  const [bondPurchases, setBondPurchases] = useState<BondPurchase[]>([]);
  const [closedMarkets, setClosedMarkets] = useState<Market[]>([]);
  const [currentMarkets, setCurrentMarkets] = useState<CalculatedMarket[]>([]);

  useEffect(() => {
    if (isLoading || !address) return;
    const ownerBalances = concatSubgraphQueryResultArrays(
      dashboardData,
      "ownerBalances"
    );
    const bondTokens = concatSubgraphQueryResultArrays(
      dashboardData,
      "bondTokens"
    );
    const bondPurchases = concatSubgraphQueryResultArrays(
      dashboardData,
      "bondPurchases"
    );
    const closedMarkets = concatSubgraphQueryResultArrays(
      dashboardData,
      "markets"
    );

    const erc20OwnerBalances: Partial<OwnerBalance>[] = [];
    const promises: Promise<any>[] = [];
    bondTokens.forEach((bondToken: BondToken) => {
      promises.push(
        getBalance(bondToken.id, address, providers[bondToken.chainId]).then(
          (result: BigNumberish) => {
            const toNumber = Number(result);
            toNumber > 0 &&
              erc20OwnerBalances.push({
                balance: toNumber,
                bondToken: bondToken,
                owner: address,
              });
          }
        )
      );
    });

    const fetchErc20OwnerBalances = async () => {
      await Promise.allSettled(promises);
      setOwnerBalances(ownerBalances.concat(erc20OwnerBalances));
    };

    setBondPurchases(bondPurchases);
    setClosedMarkets(closedMarkets);

    fetchErc20OwnerBalances();
  }, [isLoading, isTestnet]);

  useEffect(() => {
    setCurrentMarkets(
      allMarkets.filter(
        (market: CalculatedMarket) =>
          address && market.owner.toLowerCase() === address.toLowerCase()
      )
    );
  }, [allMarkets.length]);

  return {
    ownerBalances: ownerBalances,
    bondPurchases: bondPurchases,
    currentMarkets: currentMarkets,
    closedMarkets: closedMarkets,
    isLoading: isLoading,
  };
};
