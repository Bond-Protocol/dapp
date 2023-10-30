import { getSubgraphQueries } from "services";
import {
  BondPurchase,
  Market,
  OwnerBalance,
  useGetDashboardDataQuery,
} from "../generated/graphql";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { useTestnetMode } from "hooks/useTestnet";
import { useCallback, useEffect, useState } from "react";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { calculateTrimDigits, trim } from "@bond-protocol/contract-library";
import { useTokens } from "context";
import { useAccount } from "wagmi";
import { dateMath } from "ui";
import axios from "axios";
import { Token } from "types";

export type TweakedBondPurchase = BondPurchase & {
  txUrl: string;
  payoutToken: Token;
  quoteToken: Token;
  payoutPrice: number;
};

const currentTime = Math.trunc(Date.now() / 1000);

const API_ENDPOINT = import.meta.env.VITE_API_URL;

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
  const [bondPurchases, setBondPurchases] = useState([]);
  const [allMarkets, setAllMarkets] = useState<Market[]>([]);
  const [bondsIssued, setBondsIssued] = useState(0);
  const [uniqueBonders, setUniqueBonders] = useState(0);
  const [tbv, setTbv] = useState(0);
  const [userTbv, setUserTbv] = useState(0);
  const [userClaimable, setUserClaimable] = useState(0);

  const loadBondPurchases = useCallback(async () => {
    if (!address) return;
    const response = await axios.get(
      API_ENDPOINT + `users/${address}/bondPurchases`
    );
    return response.data;
  }, []);

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

    loadBondPurchases().then((response) => {
      setBondPurchases(response.bondPurchases);
      setUserTbv(response.tbvUsd);
    });

    const markets = concatSubgraphQueryResultArrays(dashboardData, "markets");
    const uniqueBonderCounts = concatSubgraphQueryResultArrays(
      dashboardData,
      "uniqueBonderCounts"
    );

    const erc20OwnerBalances: Partial<OwnerBalance>[] = [];
    const promises: Promise<any>[] = [];
    // bondTokens.forEach((bondToken: BondToken) => {
    //   promises.push(
    //     getBalance(bondToken.id, address, providers[bondToken.chainId]).then(
    //       (result: BigNumberish) => {
    //         const toNumber = Number(result);
    //         toNumber > 0 &&
    //           erc20OwnerBalances.push({
    //             balance: result,
    //             bondToken: bondToken,
    //             owner: address,
    //           });
    //       }
    //     )
    //   );
    // });

    const fetchErc20OwnerBalances = async () => {
      await Promise.allSettled(promises);

      let userClaimable = 0;
      const updatedBonds = [...ownerBalances, ...erc20OwnerBalances].map(
        (bond: Partial<OwnerBalance>) => {
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

          if (canClaim && !isNaN(usdPriceNumber))
            userClaimable += usdPriceNumber;

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
      setUserClaimable(userClaimable);
    };

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

  //Calculates market stats and adds token details to each market
  useEffect(() => {
    const hasMarkets = !!allMarkets.length;
    const hasPrices = tokens?.some((t) => !!t.price);

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
    userClaimable,
    isLoading: isLoading,
  };
};
