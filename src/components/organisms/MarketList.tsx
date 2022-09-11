//@ts-nocheck
import {ExpandableRow} from "components/molecules/ExpandableRow";
import {CalculatedMarket, Token} from "@bond-labs/contract-library";
import {getToken} from "@bond-labs/bond-library";
import {FC, useEffect, useRef, useState} from "react";
import {CloseMarketCard} from "components/organisms/CloseMarketCard";
import Button from "../atoms/Button";
import {useCalculatedMarkets, useTokens} from "hooks";
import {TableHeading} from "components/atoms/TableHeading";
import {TableCell} from "components/atoms/TableCell";
import {CellLabel} from "components/atoms/CellLabel";
import {BondListCardV2} from "./BondListCardV2";
import {useNavigate} from "react-router-dom";

type MarketListProps = {
  markets: Map<string, CalculatedMarket>;
  allowManagement: boolean;
};

export const MarketList: FC<MarketListProps> = ({
  markets,
  allowManagement,
}) => {
  const { refetchAllMarkets, refetchMyMarkets, refetchOne } =
    useCalculatedMarkets();
  const { getTokenDetails } = useTokens();
  const navigate = useNavigate();

  const [sortedMarkets, setSortedMarkets] = useState<CalculatedMarket[]>(
    Array.from(markets.values())
  );

  const marketsRef = useRef(markets);
  const timerRef = useRef<NodeJS.Timeout>();

  const numericSort = function (
    value1: number,
    value2: number,
    ascending: boolean
  ) {
    return ascending ? value1 - value2 : value2 - value1;
  };

  const alphabeticSort = function (
    value1: string,
    value2: string,
    ascending: boolean
  ) {
    return ascending ? (value1 > value2 ? 1 : -1) : value2 > value1 ? 1 : -1;
  };

  const sortMarkets = function (
    compareFunction: (m1: CalculatedMarket, m2: CalculatedMarket) => number
  ) {
    const arr: CalculatedMarket[] = [];
    marketsRef.current.forEach((value) => arr.push(value));
    setSortedMarkets(arr.sort(compareFunction));
  };

  function sortByQuote() {
    const ascending =
      currentSort.sortBy.toString() === sortByQuote.toString()
        ? !currentSort.ascending
        : true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      alphabeticSort(m1.quoteToken.symbol, m2.quoteToken.symbol, ascending)
    );
    setCurrentSort({ sortBy: sortByQuote, ascending: ascending });
  }

  function sortByPayout() {
    const ascending =
      currentSort.sortBy.toString() === sortByPayout.toString()
        ? !currentSort.ascending
        : true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      alphabeticSort(m1.payoutToken.symbol, m2.payoutToken.symbol, ascending)
    );
    setCurrentSort({ sortBy: sortByPayout, ascending: ascending });
  }

  function sortByPrice() {
    const ascending =
      currentSort.sortBy.toString() === sortByPrice.toString()
        ? !currentSort.ascending
        : true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.discountedPrice, m2.discountedPrice, ascending)
    );
    setCurrentSort({ sortBy: sortByPrice, ascending: ascending });
  }

  function sortByDiscount() {
    const ascending =
      currentSort.sortBy.toString() === sortByDiscount.toString()
        ? !currentSort.ascending
        : false;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.discount, m2.discount, ascending)
    );
    setCurrentSort({ sortBy: sortByDiscount, ascending: ascending });
  }

  function sortByTbv() {
    const ascending =
      currentSort.sortBy.toString() === sortByTbv.toString()
        ? !currentSort.ascending
        : false;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.tbvUsd, m2.tbvUsd, ascending)
    );
    setCurrentSort({ sortBy: sortByTbv, ascending: ascending });
  }

  function sortByExpiry() {
    const ascending =
      currentSort.sortBy.toString() === sortByExpiry.toString()
        ? !currentSort.ascending
        : true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.vesting, m2.vesting, ascending)
    );
    setCurrentSort({ sortBy: sortByExpiry, ascending: ascending });
  }

  function sortByStatus() {
    const ascending =
      currentSort.sortBy.toString() === sortByStatus.toString()
        ? !currentSort.ascending
        : true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(Number(m1.isLive), Number(m2.isLive), ascending)
    );
    setCurrentSort({ sortBy: sortByStatus, ascending: ascending });
  }

  const [currentSort, setCurrentSort] = useState({
    sortBy: sortByDiscount,
    ascending: true,
  });

  const singleLogo = (token: Token, network: string) => {
    const tokenDetails = getToken(network + "_" + token.address);
    return tokenDetails?.logoUrl && tokenDetails.logoUrl != ""
      ? tokenDetails.logoUrl
      : "/placeholders/token-placeholder.png";
  };

  const quoteLogo = (market: CalculatedMarket) => {
    if (market?.quoteToken.lpPair != undefined) {
      const token0 = getToken(market?.quoteToken.lpPair.token0.id);
      const token1 = getToken(market?.quoteToken.lpPair.token1.id);

      return (
        <div className="flex flex-row">
          <img
            className="h-[32px] w-[32px]"
            src={singleLogo(token0, market?.network)}
          />
          <img
            className="h-[32px] w-[32px] flex self-end ml-[-8px]"
            src={singleLogo(token1, market?.network)}
          />
        </div>
      );
    } else {
      const quote = singleLogo(market?.quoteToken, market?.network);
      const payout = singleLogo(market?.payoutToken, market?.network);

      return (
        <div className="flex flex-row">
          <img className="h-[32px] w-[32px]" src={quote} />
          <img
            className="h-[16px] w-[16px] flex self-end ml-[-8px]"
            src={payout}
          />
        </div>
      );
    }
  };

  useEffect(() => {
    marketsRef.current = markets;
    currentSort.sortBy();
  }, [markets]);

  return (
    <div className="mb-16">
      <p className="flex justify-end p-2">
        {allowManagement ? (
          <Button onClick={refetchMyMarkets}>Refresh</Button>
        ) : (
          <Button onClick={refetchAllMarkets}>Refresh</Button>
        )}
      </p>
      <table className="w-full table-fixed">
        <thead>
          <tr>
            <TableHeading onClick={sortByQuote}>BOND</TableHeading>
            <TableHeading onClick={sortByPrice}>PRICE</TableHeading>
            <TableHeading onClick={sortByDiscount}>DISCOUNT</TableHeading>
            <TableHeading>30D Perf.</TableHeading>
            <TableHeading onClick={sortByExpiry}>EXPIRY</TableHeading>
            {allowManagement && (
              <TableHeading onClick={sortByStatus}>STATUS</TableHeading>
            )}
            <TableHeading onClick={sortByTbv}>TBV</TableHeading>
          </tr>
        </thead>

        <tbody>
          {sortedMarkets.map((market: CalculatedMarket) => {
            const quoteToken = getTokenDetails(market.quoteToken);
            return (
              <ExpandableRow
                key={market.id}
                onOpen={() => {
                  timerRef.current = setInterval(() => {
                    refetchOne(market.id);
                  }, 13 * 1000);
                }}
                onClose={() => clearInterval(timerRef.current)}
                expanded={
                  market ? (
                    allowManagement ? (
                      <CloseMarketCard market={market} />
                    ) : (
                      <BondListCardV2
                        infoLabel
                        market={market}
                        topRightLabel={"VIEW INSIGHTS"}
                        onClickTopRight={() => {
                          navigate("/market/" + market.marketId);
                        }}
                      />
                    )
                  ) : (
                    <div>Loading...</div>
                  )
                }
                className="gap-x-2"
              >
                <TableCell>{quoteLogo(market)}</TableCell>
                <TableCell className="flex flex-row py-6">
                  <CellLabel
                    logo={singleLogo(market?.payoutToken, market?.network)}
                    subContent={`(Market: ${market?.formattedFullPrice})`}
                  >
                    {market?.formattedDiscountedPrice}
                  </CellLabel>
                </TableCell>
                <TableCell
                  className={`${
                    market?.discount > 0 ? "text-light-success" : "text-red-300"
                  }`}
                >
                  {market?.discount}%
                </TableCell>
                <TableCell>{0}%</TableCell>
                <TableCell>{market?.formattedLongVesting}</TableCell>
                <TableCell>
                  <CellLabel subContent={market.formattedTbvUsd}>
                    <p>
                      {Math.trunc(market.totalBondedAmount) +
                        " " +
                        quoteToken.symbol}
                    </p>
                  </CellLabel>
                </TableCell>

                {allowManagement && (
                  <TableCell>
                    {market && market.isLive ? "Live" : "Closed"}
                  </TableCell>
                )}
              </ExpandableRow>
            );
          })}
        </tbody>
      </table>
      <tfoot>
        <tr>{/* <TablePagination length={sortedMarkets.length} /> */}</tr>
      </tfoot>
    </div>
  );
};
