import {
  calculateTrimDigits,
  getBalance,
  trim,
} from "@bond-protocol/contract-library";
import { useAccount } from "wagmi";
import { dateMath } from "ui";
import { Token } from "types";
import { useQuery } from "@tanstack/react-query";
import { useGetSubgraphQueries } from "services";
import { clients } from "context";
import {
  BondPurchase,
  GetDashboardDataDocument,
  GetDashboardDataQuery,
} from "../generated/graphql";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useTokens } from "hooks";
import axios from "axios";

export type DetailedBondPurchase = BondPurchase & {
  txUrl: string;
  payoutToken: Token;
  quoteToken: Token;
  payoutPrice: number;
};

const currentTime = Math.trunc(Date.now() / 1000);

const API_ENDPOINT = import.meta.env.VITE_API_URL;

type BondPurchaseQuery = {
  bondPurchases: DetailedBondPurchase;
  tbvUsd: number;
};

export const useDashboard = () => {
  const { address } = useAccount();
  const tokens = useTokens();

  const { queries: dashboardData, ...dashboardQuery } =
    useGetSubgraphQueries<GetDashboardDataQuery>({
      document: GetDashboardDataDocument,
      variables: {
        address: address || "NO_ADDRESS",
        currentTime: currentTime,
      },
    });

  const { getByAddress } = useTokens();

  const bondBalanceQuery = useQuery({
    enabled: address && !dashboardQuery.isLoading,
    queryKey: ["dashboard/bond-tokens", address],
    queryFn: () => {
      const bondTokens = concatSubgraphQueryResultArrays(
        dashboardData,
        "bondTokens"
      );

      return Promise.all(
        bondTokens.map(async (bondToken: any) => {
          const client = clients[bondToken.chainId];
          try {
            const _balance = await getBalance(bondToken.id, address!, client);
            const balance = Number(_balance);

            return {
              balance,
              bondToken: bondToken,
              owner: address,
            };
          } catch (e) {
            console.error(e);
            return {
              balance: 0,
              bondToken,
              owner: address,
            };
          }
        })
      );
    },
  });

  const bondPurchasesQuery = useQuery({
    enabled: !!address,
    queryKey: ["dashboard/bond-purchases", address],
    queryFn: () =>
      axios
        .get<BondPurchaseQuery>(API_ENDPOINT + `users/${address}/bondPurchases`)
        .then((r) => r.data),
  });

  const dashboardProcessingQuery = useQuery({
    enabled: bondBalanceQuery.isSuccess && !tokens.isLoading,
    queryKey: ["dashboard/balances", address],
    queryFn: () => {
      const ownerBalances = concatSubgraphQueryResultArrays(
        dashboardData,
        "ownerBalances"
      );

      const markets = concatSubgraphQueryResultArrays(dashboardData, "markets");

      const uniqueBonderCounts = concatSubgraphQueryResultArrays(
        dashboardData,
        "uniqueBonderCounts"
      );

      const bondPurchases = concatSubgraphQueryResultArrays(
        dashboardData,
        "bondPurchases"
      );

      const erc20OwnerBalances = bondBalanceQuery.data;

      const balances =
        erc20OwnerBalances?.flat().filter((q) => !!q.balance) ?? [];

      let userClaimable = 0;
      const updatedBonds = [...ownerBalances, ...balances].map((bond) => {
        if (!bond.bondToken || !bond.bondToken.underlying) return;
        const date = new Date(bond.bondToken.expiry * 1000);
        const now = new Date(Date.now());
        const canClaim = now >= date;

        //Some tokens are missing the address in the underlying component, we take them from the id
        //Added for poker night bonds, should rarely be the used and should be removed
        let tokenAddress = bond.bondToken.underlying?.address;
        let updated =
          tokenAddress ?? bond.bondToken.underlying.id.split("_")[1];

        const underlying = getByAddress(updated);

        let balance: number | string =
          bond.balance / Math.pow(10, bond.bondToken.underlying.decimals);
        balance = trim(balance, calculateTrimDigits(balance));

        const usdPriceNumber: number = underlying?.price
          ? underlying.price * Number(balance)
          : 0;

        if (canClaim && !isNaN(usdPriceNumber)) userClaimable += usdPriceNumber;

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
      });

      const pastBonds = markets.reduce(
        (total, m) => total + m.bondPurchases?.length!,
        0
      );

      return {
        bondPurchases,
        ownerBalances: updatedBonds,
        userClaimable,
        allMarkets: markets,
        uniqueBonders: uniqueBonderCounts[0] ?? 0,
        bondsIssued: pastBonds,
      };
    },
  });

  const { data: allMarkets = [] } = useQuery({
    enabled: dashboardProcessingQuery.isSuccess,
    queryKey: ["dashboard/markets", address],
    queryFn: () => {
      return dashboardProcessingQuery.data?.allMarkets.map((market) => {
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
              avgPrice = avgPrice / (i + 1);
            }

            const result = {
              quoteUsd: all.quoteUsd + totalQuoteUsd,
              payoutUsd: all.payoutUsd + totalPayoutUsd,
              quote: all.quote + Number(p.amount),
              payout: all.payout + Number(p.payout),
              avgPrice,
            };
            return result;
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
    },
  });

  // const { data: tbv = 0 } = useQuery({
  //   queryKey: ["dashboard/tbv", address],
  //   enabled: dashboardProcessingQuery.isSuccess && !tokens.isLoading,
  //   queryFn: () => {
  //     return dashboardProcessingQuery.data?.bondPurchases.reduce((total, p) => {
  //       const token = tokens.getByAddress(p.quoteToken.address.toLowerCase());

  //       if (!token || !token.price) return total;

  //       return (total += token.price * p.amount);
  //     }, 0);
  //   },
  // });

  return {
    allMarkets,
    isLoading:
      !dashboardProcessingQuery.isFetched || dashboardProcessingQuery.isLoading,
    ownerBalances: dashboardProcessingQuery.data?.ownerBalances,
    bondPurchases: bondPurchasesQuery.data?.bondPurchases ?? [],
    bondsIssued: dashboardProcessingQuery.data?.bondsIssued,
    uniqueBonders: dashboardProcessingQuery.data?.uniqueBonders.count,
    tbv: bondPurchasesQuery?.data?.tbvUsd ?? 0,
    userClaimable: dashboardProcessingQuery.data?.userClaimable ?? 0,
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
  };
};
