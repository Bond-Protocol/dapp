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
import {
  CalculatedMarket,
  calculateTrimDigits,
  getBalance,
  trim,
} from "@bond-protocol/contract-library";
import { BigNumberish } from "ethers";
import { useCalculatedMarkets } from "hooks/useCalculatedMarkets";
import { useAccount, useChainId } from "wagmi";
import { useTokens } from "context";

const currentTime = Math.trunc(Date.now() / 1000);

export const useDashboardLoader = () => {
  const { address } = useAccount();
  const { allMarkets } = useCalculatedMarkets();
  const chainId = useChainId();

  const dashboardData = getSubgraphQueries(useGetDashboardDataQuery, {
    address: address,
    currentTime: currentTime,
  });
  const { isLoading } = useSubgraphLoadingCheck(dashboardData);
  const { getByAddress } = useTokens();

  const [isTestnet] = useTestnetMode();
  const [ownerBalances, setOwnerBalances] = useState<Partial<OwnerBalance>[]>(
    []
  );
  const [bondPurchases, setBondPurchases] = useState<BondPurchase[]>([]);
  const [closedMarkets, setClosedMarkets] = useState<Market[]>([]);
  const [currentMarkets, setCurrentMarkets] = useState<CalculatedMarket[]>([]);
  const [bondsIssued, setBondsIssued] = useState(0);
  const [uniqueBonders, setUniqueBonders] = useState(0);
  const [tbv, setTbv] = useState(0);

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
    const uniqueBonderCounts = concatSubgraphQueryResultArrays(
      dashboardData,
      "uniqueBonderCounts"
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

      const updatedBonds = [...ownerBalances, ...erc20OwnerBalances].map(
        (bond: Partial<OwnerBalance>) => {
          if (!bond.bondToken || !bond.bondToken.underlying) return;
          const date = new Date(bond.bondToken.expiry * 1000);
          const now = new Date(Date.now());
          const canClaim = now >= date;

          //const purchase = purchases?.data?.bondPurchases.find();
          const underlying = getByAddress(bond.bondToken?.underlying.address);

          let balance: number | string =
            bond.balance / Math.pow(10, bond.bondToken.underlying.decimals);
          balance = trim(balance, calculateTrimDigits(balance));

          const usdPriceNumber: number = underlying?.price
            ? underlying.price * Number(balance)
            : 0;
          const usdPriceString: string = usdPriceNumber
            ? trim(usdPriceNumber, calculateTrimDigits(usdPriceNumber))
            : "";

          //  const isCorrectNetwork = Number(bond.bondToken.chainId) === chainId;

          return {
            bond,
            balance,
            usdPriceString,
            usdPriceNumber,
            underlying,
            //  isCorrectNetwork,
            canClaim,
          };
        }
      );

      setOwnerBalances(updatedBonds);
    };

    setBondPurchases(bondPurchases);
    setClosedMarkets(closedMarkets);
    uniqueBonderCounts[0] && setUniqueBonders(uniqueBonderCounts[0].count);

    fetchErc20OwnerBalances();
  }, [isLoading, isTestnet]);

  useEffect(() => {
    const markets = allMarkets.filter(
      (market: CalculatedMarket) =>
        address && market.owner.toLowerCase() === address.toLowerCase()
    );
    setCurrentMarkets(markets);

    const closedTbv = closedMarkets.reduce((tbv, m) => {
      const price = getByAddress(m.quoteToken.address)?.price ?? 0;
      return tbv + Number(m.totalBondedAmount) * price;
    }, 0);

    const tbv =
      closedTbv +
      markets.reduce((tbv, m) => {
        return tbv + m.tbvUsd;
      }, 0);

    setTbv(tbv);

    const bonds = markets.reduce((count, m) => {
      return count + Number(m.bondsIssued);
    }, 0);

    setBondsIssued(bonds);
  }, [allMarkets.length]);

  return {
    ownerBalances: ownerBalances,
    bondPurchases: bondPurchases,
    currentMarkets: currentMarkets,
    closedMarkets: closedMarkets,
    bondsIssued: bondsIssued,
    uniqueBonders: uniqueBonders,
    tbv: tbv,
    isLoading: isLoading,
  };
};
