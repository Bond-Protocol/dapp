import {ExpandableRow} from "components/molecules/ExpandableRow";
import {CalculatedMarket} from "@bond-labs/contract-library";
import {BondListCard} from "components/organisms/BondListCard";
import {FC, useEffect, useState} from "react";
import {CloseMarketCard} from "components/organisms/CloseMarketCard";

type MarketListProps = {
  markets: Map<string, CalculatedMarket>;
  allowManagement: boolean
}

export const MarketList: FC<MarketListProps> = ({markets, allowManagement}) => {
  const [sortedMarkets, setSortedMarkets] = useState<CalculatedMarket[]>(Array.from(markets.values()));
  const [currentSort, setCurrentSort] = useState({sortBy: "discount", ascending: false});

  useEffect(() => {
  }, [markets]);

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
    markets?.forEach(value => arr.push(value));
    setSortedMarkets(arr.sort(compareFunction));
  };

  const sortByQuote = function () {
    const ascending = currentSort.sortBy === "quote" ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      alphabeticSort(m1.quoteToken.symbol, m2.quoteToken.symbol, ascending)
    );
    setCurrentSort({sortBy: "quote", ascending: ascending});
  };

  const sortByPayout = function () {
    const ascending = currentSort.sortBy === "payout" ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      alphabeticSort(m1.payoutToken.symbol, m2.payoutToken.symbol, ascending)
    );
    setCurrentSort({sortBy: "payout", ascending: ascending});
  };

  const sortByPrice = function () {
    const ascending = currentSort.sortBy === "price" ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.discountedPrice, m2.discountedPrice, ascending)
    );
    setCurrentSort({sortBy: "price", ascending: ascending});
  };

  const sortByDiscount = function () {
    const ascending = currentSort.sortBy === "discount" ?
      !currentSort.ascending :
      false;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.discount, m2.discount, ascending)
    );
    setCurrentSort({sortBy: "discount", ascending: ascending});
  };

  const sortByExpiry = function () {
    const ascending = currentSort.sortBy === "expiry" ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.vesting, m2.vesting, ascending)
    );
    setCurrentSort({sortBy: "expiry", ascending: ascending});
  };

  const sortByStatus = function () {
    const ascending = currentSort.sortBy === "status" ?
      !currentSort.ascending :
      true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(Number(m1.isLive), Number(m2.isLive), ascending)
    );
    setCurrentSort({sortBy: "status", ascending: ascending});
  };

  useEffect(() => {
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.discount, m2.discount, false)
    );
  }, [markets]);

  return (
    <>
      <table className="w-full text-left table-fixed">
        <thead>
          <tr>
            <th onClick={sortByQuote}>Bond</th>
            <th onClick={sortByPayout}>Payout Asset</th>
            <th onClick={sortByPrice}>Price</th>
            <th onClick={sortByDiscount}>Discount</th>
            <th>TBV</th>
            <th>30D Perf.</th>
            <th onClick={sortByExpiry}>Expiry</th>
            {allowManagement && <th onClick={sortByStatus}>Status</th>}
          </tr>
        </thead>

        <tbody>
          {sortedMarkets.map((market: CalculatedMarket) => {
            const calculatedMarket = markets?.get(market.id);
            return (
              <ExpandableRow key={market.id} expanded={
                calculatedMarket ?
                  (allowManagement ?
                    (<CloseMarketCard market={calculatedMarket} />) :
                    (<BondListCard market={calculatedMarket}/>)
                  ) :
                  (<div>Loading...</div>)
              } className="gap-x-2">
                <td>{market.quoteToken.symbol}</td>
                <td>{market.payoutToken.symbol}</td>
                <td>
                  <p>{calculatedMarket?.formattedDiscountedPrice}</p>
                  <p className="text-xs">(Market: {calculatedMarket?.formattedFullPrice})</p>
                </td>
                <td>{calculatedMarket?.discount}%</td>
                <td>${0}</td>
                <td>{0}%</td>
                <td>{calculatedMarket?.formattedLongVesting}</td>
                {allowManagement && <td>{calculatedMarket && calculatedMarket.isLive ? "Live": "Closed"}</td>}
              </ExpandableRow>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
