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
  calculateTrimDigits,
  getBalance,
  trim,
} from "@bond-protocol/contract-library";
import { BigNumberish } from "ethers";
import { useTokens } from "context";
import { useAccount } from "wagmi";
import { dateMath } from "ui";

const currentTime = Math.trunc(Date.now() / 1000);

const hasClosed = (market: Market) =>
  dateMath.isBefore(new Date(market.conclusion * 1000), new Date()) ||
  market.hasClosed;

export const useDashboardLoader = () => {
  const { address } = useAccount();

  const dashboardData = getSubgraphQueries(useGetDashboardDataQuery, {
    address: address || "NO_ADDRESS",
    currentTime: currentTime,
  });

  const { isLoading } = useSubgraphLoadingCheck(dashboardData);
  const { tokens, getByAddress } = useTokens();

  const [isTestnet] = useTestnetMode();
  const [ownerBalances, setOwnerBalances] = useState<Partial<OwnerBalance>[]>(
    []
  );
  const [bondPurchases, setBondPurchases] = useState<BondPurchase[]>([]);
  const [allMarkets, setAllMarkets] = useState<Market[]>([]);
  const [bondsIssued, setBondsIssued] = useState(0);
  const [uniqueBonders, setUniqueBonders] = useState(0);
  const [tbv, setTbv] = useState(0);
  const [userTbv, setUserTbv] = useState(0);

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

    const markets = concatSubgraphQueryResultArrays(dashboardData, "markets");
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

      //@ts-ignore
      setOwnerBalances(updatedBonds);
    };

    setBondPurchases(bondPurchases);
    setAllMarkets(markets);

    uniqueBonderCounts[0] && setUniqueBonders(uniqueBonderCounts[0].count);

    fetchErc20OwnerBalances();
  }, [tokens, isLoading, isTestnet]);

  //Calculate user markets TBV and total bonds
  useEffect(() => {
    const tbv = allMarkets.reduce((tbv, m) => {
      const price = getByAddress(m.quoteToken.address)?.price ?? 0;
      return tbv + Number(m.totalBondedAmount) * price;
    }, 0);

    setTbv(tbv);

    const pastBonds = allMarkets.reduce(
      (total, m) => total + m.bondPurchases?.length!,
      0
    );

    setBondsIssued(pastBonds);
  }, [allMarkets]);

  //Calculates TBV for user purchases
  useEffect(() => {
    const hasPurchases = !!bondPurchases.length;
    const hasPrices = tokens.some((t) => !!t.price);

    if (hasPrices && hasPurchases) {
      const tbv = bondPurchases.reduce((tbv, purchase) => {
        const price = getByAddress(purchase.payoutToken.address)?.price ?? 0;
        return tbv + price * purchase.payout;
      }, 0);
      setUserTbv(tbv);
    }
  }, [tokens, bondPurchases.length]);

  //Calculates market stats and adds token details to each market
  useEffect(() => {
    const hasMarkets = !!allMarkets.length;
    const hasPrices = tokens.some((t) => !!t.price);

    if (hasPrices && hasMarkets) {
      const updated = allMarkets.map((market) => {
        const quoteToken = getByAddress(market.quoteToken.address);
        const payoutToken = getByAddress(market.payoutToken.address);
        const total = market.bondPurchases?.reduce(
          (all, p, i, arr) => {
            const quotePrice = quoteToken?.price ?? 0;
            const payoutPrice = payoutToken?.price ?? 0;

            const totalQuoteUsd = quotePrice * Number(p.amount);
            const totalPayoutUsd = payoutPrice * Number(p.payout);

            let avgPrice = all.avgPrice + Number(p.purchasePrice);

            if (i === arr.length - 1) {
              avgPrice = avgPrice / i;
            }

            return {
              quoteUsd: all.quoteUsd + totalQuoteUsd,
              payoutUsd: all.payoutUsd + totalPayoutUsd,
              quote: all.quote + Number(p.amount),
              payout: all.payout + Number(p.payout),
              avgPrice,
            };
          },
          { quoteUsd: 0, payoutUsd: 0, quote: 0, payout: 0, avgPrice: 0 }
        );
        return {
          ...market,
          total,
          quoteToken: quoteToken ?? market.quoteToken,
          payoutToken: payoutToken ?? market.payoutToken,
        };
      });
      //@ts-ignore
      setAllMarkets(updated);
    }
  }, [tokens, allMarkets.length]);

  //Calculates TBV for purchases
  useEffect(() => {
    const hasPurchases = !!bondPurchases.length;
    const hasPrices = tokens.some((t) => !!t.price);

    if (hasPrices && hasPurchases) {
      const tbv = bondPurchases.reduce((tbv, purchase) => {
        const price = getByAddress(purchase.payoutToken.address)?.price ?? 0;
        return tbv + price * purchase.payout;
      }, 0);
      setUserTbv(tbv);
    }
  }, [tokens, bondPurchases.length]);

  //Calculates claimable value for purchases

  return {
    ownerBalances,
    bondPurchases,
    allMarkets,
    currentMarkets: allMarkets.filter(
      (m) =>
        !m.hasClosed &&
        !dateMath.isBefore(new Date(m.conclusion * 1000), new Date())
    ),
    closedMarkets: allMarkets.filter(
      (m) =>
        m.hasClosed ||
        dateMath.isBefore(new Date(m.conclusion * 1000), new Date())
    ),
    bondsIssued,
    uniqueBonders,
    tbv,
    userTbv,
    isLoading: isLoading,
  };
};
