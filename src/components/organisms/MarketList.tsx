import {ExpandableRow} from "components/molecules/ExpandableRow";
import {CalculatedMarket} from "@bond-labs/contract-library";
import {BondListCard} from "components/organisms/BondListCard";
import {FC, useEffect, useRef, useState} from "react";
import {CloseMarketCard} from "components/organisms/CloseMarketCard";
import Button from "../atoms/Button";
import {useCalculatedMarkets, useTokens} from "hooks";

type MarketListProps = {
  markets: Map<string, CalculatedMarket>;
  allowManagement: boolean
}

export const MarketList: FC<MarketListProps> = ({markets, allowManagement}) => {
  const {refetchAllMarkets, refetchMyMarkets, refetchOne} = useCalculatedMarkets();
  const {getTokenDetails} = useTokens();

  const [sortedMarkets, setSortedMarkets] = useState<CalculatedMarket[]>(Array.from(markets.values()));

  const marketsRef = useRef(markets);
  const timerRef = useRef<NodeJS.Timeout>();

  const numericSort = function (value1: number, value2: number, ascending: boolean) {
    return ascending ?
      value1 - value2 :
      value2 - value1;
  };

  const alphabeticSort = function (value1: string, value2: string, ascending: boolean) {
    return ascending ?
      (value1 > value2 ? 1 : -1) :
      (value2 > value1 ? 1 : -1);
  };

  const sortMarkets = function (compareFunction: (m1: CalculatedMarket, m2: CalculatedMarket) => number) {
    const arr: CalculatedMarket[] = [];
    marketsRef.current.forEach(value => arr.push(value));
    setSortedMarkets(arr.sort(compareFunction));
  };

  function sortByQuote() {
    const ascending = currentSort.sortBy.toString() === sortByQuote.toString() ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      alphabeticSort(m1.quoteToken.symbol, m2.quoteToken.symbol, ascending)
    );
    setCurrentSort({sortBy: sortByQuote, ascending: ascending});
  }

  function sortByPayout() {
    const ascending = currentSort.sortBy.toString() === sortByPayout.toString() ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      alphabeticSort(m1.payoutToken.symbol, m2.payoutToken.symbol, ascending)
    );
    setCurrentSort({sortBy: sortByPayout, ascending: ascending});
  }

  function sortByPrice() {
    const ascending = currentSort.sortBy.toString() === sortByPrice.toString() ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.discountedPrice, m2.discountedPrice, ascending)
    );
    setCurrentSort({sortBy: sortByPrice, ascending: ascending});
  }

  function sortByDiscount() {
    const ascending = currentSort.sortBy.toString() === sortByDiscount.toString() ?
      !currentSort.ascending :
      false;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.discount, m2.discount, ascending)
    );
    setCurrentSort({sortBy: sortByDiscount, ascending: ascending});
  }

  function sortByTbv() {
    const ascending = currentSort.sortBy.toString() === sortByTbv.toString() ?
      !currentSort.ascending :
      false;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.tbvUsd, m2.tbvUsd, ascending)
    );
    setCurrentSort({sortBy: sortByTbv, ascending: ascending});
  }

  function sortByExpiry() {
    const ascending = currentSort.sortBy.toString() === sortByExpiry.toString() ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.vesting, m2.vesting, ascending)
    );
    setCurrentSort({sortBy: sortByExpiry, ascending: ascending});
  }

  function sortByStatus() {
    const ascending = currentSort.sortBy.toString() === sortByStatus.toString() ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(Number(m1.isLive), Number(m2.isLive), ascending)
    );
    setCurrentSort({sortBy: sortByStatus, ascending: ascending});
  }

  const [currentSort, setCurrentSort] = useState({sortBy: sortByDiscount, ascending: true});

  useEffect(() => {
    marketsRef.current = markets;
    currentSort.sortBy();
  }, [markets]);

  return (
    <>
      <p className="flex justify-end p-2">
        {allowManagement ?
          <Button onClick={refetchMyMarkets}>Refresh</Button> :
          <Button onClick={refetchAllMarkets}>Refresh</Button>
        }
      </p>
      <table className="w-full text-left table-fixed">
        <thead>
          <tr>
            <th onClick={sortByQuote}>Bond</th>
            <th onClick={sortByPayout}>Payout Asset</th>
            <th onClick={sortByPrice}>Price</th>
            <th onClick={sortByDiscount}>Discount</th>
            <th onClick={sortByTbv}>TBV</th>
            <th>30D Perf.</th>
            <th onClick={sortByExpiry}>Expiry</th>
            {allowManagement && <th onClick={sortByStatus}>Status</th>}
          </tr>
        </thead>

        <tbody>
          {sortedMarkets.map((market: CalculatedMarket) => {
            const quoteToken = getTokenDetails(market.quoteToken);
            const payoutToken = getTokenDetails(market.payoutToken);
            return (
              <ExpandableRow key={market.id}
                onOpen={() => {
                  timerRef.current = setInterval(() => {
                    refetchOne(market.id);
                  }, 13 * 1000);
                }}
                onClose={() => clearInterval(timerRef.current)}
                expanded={
                  market ?
                    (allowManagement ?
                      (<CloseMarketCard market={market}/>) :
                      (<BondListCard market={market}/>)
                    ) :
                    (<div>Loading...</div>)
                } className="gap-x-2">
                <td>{quoteToken.symbol}</td>
                <td>{payoutToken.symbol}</td>
                <td>
                  <p>{market?.formattedDiscountedPrice}</p>
                  <p className="text-xs">(Market: {market?.formattedFullPrice})</p>
                </td>
                <td>{market?.discount}%</td>
                <td>
                  <p>{Math.trunc(market.totalBondedAmount) + " " + quoteToken.symbol}</p>
                  <p className="text-xs">({market.formattedTbvUsd})</p>
                </td>
                <td>{0}%</td>
                <td>{market?.formattedLongVesting}</td>
                {allowManagement && <td>{market && market.isLive ? "Live" : "Closed"}</td>}
              </ExpandableRow>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
