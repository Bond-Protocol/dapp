import {ExpandableRow} from "components/molecules/ExpandableRow";
import {CalculatedMarket, Token} from "@bond-labs/contract-library";
import {getToken} from "@bond-labs/bond-library";
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

  const singleLogo = (token: Token, network: string) => {
    const tokenDetails = getToken(network + "_" + token.address);
    return tokenDetails?.logoUrl && tokenDetails.logoUrl != "" ?
      tokenDetails.logoUrl :
      "/placeholders/token-placeholder.png";
  };

  const quoteLogo = (market: CalculatedMarket) => {
    if (market?.quoteToken.lpPair != undefined) {
      const token0 = getToken(market?.quoteToken.lpPair.token0.id);
      const token1 = getToken(market?.quoteToken.lpPair.token1.id);

      return (
        <div className="flex flex-row">
          <img className="h-[32px] w-[32px]" src={singleLogo(token0, market?.network)}/>
          <img className="h-[32px] w-[32px] flex self-end ml-[-8px]" src={singleLogo(token1, market?.network)}/>
        </div>
      );
    } else {
      const quote = singleLogo(market?.quoteToken, market?.network);
      const payout = singleLogo(market?.payoutToken, market?.network);

      return (
        <div className="flex flex-row">
          <img className="h-[32px] w-[32px]" src={quote}/>
          <img className="h-[16px] w-[16px] flex self-end ml-[-8px]" src={payout}/>
        </div>
      );
    }
  };

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
                <td>{quoteLogo(market)}</td>
                <td className="flex flex-row">
                  <div>
                    <img className="h-[32px] w-[32px]" src={singleLogo(market?.payoutToken, market?.network)}/>
                  </div>
                  <div>
                    <p>{market?.formattedDiscountedPrice}</p>
                    <p className="text-xs">(Market: {market?.formattedFullPrice})</p>
                  </div>
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
