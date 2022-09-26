//@ts-nocheck
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket, Token } from "@bond-protocol/contract-library";
import { getToken } from "@bond-protocol/bond-library";
import { ExpandableRow } from "components/molecules/ExpandableRow";
import { CloseMarketCard } from "components/organisms/CloseMarketCard";
import Button from "../atoms/Button";
import { useCalculatedMarkets } from "hooks";
import { TableHeading } from "components/atoms/TableHeading";
import { TableCell } from "components/atoms/TableCell";
import { CellLabel } from "components/atoms/CellLabel";
import { BondListCard } from "./BondListCard";

type MarketListProps = {
  markets: Map<string, CalculatedMarket>;
  allowManagement?: boolean;
};

export const MarketList: FC<MarketListProps> = ({
  markets,
  allowManagement,
}) => {
  const { refetchAllMarkets, refetchMyMarkets, refetchOne } =
    useCalculatedMarkets();
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

  function sortByQuoteToken() {
    const ascending =
      currentSort.sortBy.toString() === sortByQuoteToken.toString()
        ? !currentSort.ascending
        : true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      alphabeticSort(m1.quoteToken.symbol, m2.quoteToken.symbol, ascending)
    );
    setCurrentSort({ sortBy: sortByQuoteToken, ascending: ascending });
  }

  function sortByMaxPayout() {
    const ascending =
      currentSort.sortBy.toString() === sortByMaxPayout.toString()
        ? !currentSort.ascending
        : false;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      alphabeticSort(m1.maxPayoutUsd, m2.maxPayoutUsd, ascending)
    );
    setCurrentSort({ sortBy: sortByMaxPayout, ascending: ascending });
  }

  function sortByPrice() {
    const ascending =
      currentSort.sortBy.toString() === sortByPrice.toString()
        ? !currentSort.ascending
        : false;
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

  function sortByVesting() {
    const ascending =
      currentSort.sortBy.toString() === sortByVesting.toString()
        ? !currentSort.ascending
        : true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(m1.vesting, m2.vesting, ascending)
    );
    setCurrentSort({ sortBy: sortByVesting, ascending: ascending });
  }

  function sortByCreation() {
    const ascending =
      currentSort.sortBy.toString() === sortByVesting.toString()
        ? !currentSort.ascending
        : true;
    sortMarkets((m1: CalculatedMarket, m2: CalculatedMarket) =>
      numericSort(
        m1.creationBlockTimestamp,
        m2.creationBlockTimestamp,
        ascending
      )
    );
    setCurrentSort({ sortBy: sortByVesting, ascending: ascending });
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
    if (!token) return "/placeholders/token-placeholder.png";
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
    <div>
      <p className="flex justify-end p-2">
        {allowManagement ? (
          <Button onClick={refetchMyMarkets}>Refresh</Button>
        ) : (
          <Button onClick={refetchAllMarkets}>Refresh</Button>
        )}
      </p>
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-white/60">
            <TableHeading
              ascending={currentSort.ascending}
              sortName="name"
              onClick={sortByQuoteToken}
            >
              BOND
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="price"
              onClick={sortByPrice}
            >
              PRICE
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="discount"
              onClick={sortByDiscount}
            >
              DISCOUNT
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="maxPayout"
              onClick={sortByMaxPayout}
            >
              MAX PAYOUT
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="vesting"
              onClick={sortByVesting}
            >
              VESTING
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="creation"
              onClick={sortByCreation}
            >
              CREATED
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="tbv"
              onClick={sortByTbv}
            >
              TBV
            </TableHeading>

            {allowManagement && (
              <TableHeading
                ascending={currentSort.ascending}
                sortName="status"
                onClick={sortByStatus}
              >
                STATUS
              </TableHeading>
            )}
          </tr>
        </thead>

        <tbody>
          {sortedMarkets.map((market: CalculatedMarket) => {
            return (
              <ExpandableRow
                key={market.id}
                className="gap-x-2 border-y border-white/15"
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
                      <BondListCard
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
              >
                <TableCell>
                  <div className="flex flex-column">
                    <p className="w-[48px]">{quoteLogo(market)}</p>
                    <p className="pl-4">{market.quoteToken.symbol}</p>
                  </div>
                </TableCell>

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

                <TableCell>
                  <CellLabel subContent={`(${market.formattedMaxPayoutUsd})`}>
                    {market.maxPayout} {market.payoutToken.symbol}
                  </CellLabel>
                </TableCell>

                <TableCell>{market?.formattedLongVesting}</TableCell>

                <TableCell>
                  <p>{market.creationDate}</p>
                </TableCell>

                <TableCell>{market.formattedTbvUsd}</TableCell>

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
    </div>
  );
};
