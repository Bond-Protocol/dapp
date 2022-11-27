import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import {
  ExpandableRow,
  TableHeading,
  TableCell,
  CellLabel,
  Button,
  Loading,
} from "ui";
import { CloseMarketCard } from "components/organisms/CloseMarketCard";
import { useMarkets, useTokens } from "hooks";
import { BondListCard } from "./BondListCard";
import { socials } from "..";
import { useAtom } from "jotai";
import sortAtom from "../../atoms/marketListSort.atom";

type MarketListProps = {
  markets?: Map<string, CalculatedMarket>;
  allowManagement?: boolean;
};

export const MarketList: FC<MarketListProps> = ({
  allowManagement,
  ...props
}) => {
  const navigate = useNavigate();
  const { getTokenDetails } = useTokens();
  const { refetchOne, allMarkets, isLoading } = useMarkets();
  const [marketSort, setMarketSort] = useAtom(sortAtom);

  const markets = props.markets || allMarkets;

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
      numericSort(m1.maxPayoutUsd, m2.maxPayoutUsd, ascending)
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

  const quoteLogo = (market: CalculatedMarket) => {
    if (
      "lpPair" in market.quoteToken &&
      market.quoteToken.lpPair != undefined
    ) {
      const token0 = getTokenDetails(market.quoteToken.lpPair.token0).logoUrl;
      const token1 = getTokenDetails(market.quoteToken.lpPair.token1).logoUrl;

      return (
        <div className="flex flex-row">
          <img className="h-[32px] w-[32px]" src={token0} />
          <img
            className="ml-[-8px] flex h-[32px] w-[32px] self-end"
            src={token1}
          />
        </div>
      );
    } else {
      const quote = getTokenDetails(market.quoteToken).logoUrl;
      const payout = getTokenDetails(market.payoutToken).logoUrl;

      return (
        <div className="flex flex-row">
          <img className="h-[32px] w-[32px]" src={quote} />
          <img
            className="ml-[-8px] flex h-[16px] w-[16px] self-end"
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

  if (isLoading.market || isLoading.priceCalcs) {
    return <Loading content="markets" />;
  }

  if (
    Object.values(isLoading).some((loading) => loading) ||
    allMarkets.size === 0
  ) {
    return (
      <div className="flex flex-col">
        <div className="mt-20 text-center text-5xl uppercase leading-normal">
          No Bond Markets <br />
          are currently open
        </div>
        <div className="flex flex-col items-center justify-center pt-8">
          <a href={socials.discord} target="_blank">
            <Button>Join our Discord</Button>
          </a>
          <p className="pt-2 text-sm uppercase">for the latest updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <table className="w-full table-fixed font-jakarta">
        <col className="w-[12%]" />
        <col className="w-[10%]" />
        <col className="w-[12%]" />
        <col className="w-[10%]" />
        <col className="w-[12%]" />
        <col className="w-[12%]" />
        <col className="w-[10%]" />
        <col className="w-[2%]" />

        <thead>
          <tr className="border-b border-white/60 child:pl-3">
            <TableHeading
              ascending={currentSort.ascending}
              sortName="name"
              onClick={sortByQuoteToken}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              BOND
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="price"
              onClick={sortByPrice}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              PRICE
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="discount"
              onClick={sortByDiscount}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              DISCOUNT
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="maxPayout"
              onClick={sortByMaxPayout}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              MAX PAYOUT
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="vesting"
              onClick={sortByVesting}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              VESTING
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="creation"
              onClick={sortByCreation}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              CREATED
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="tbv"
              onClick={sortByTbv}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              TBV
            </TableHeading>
            <TableHeading />
            {allowManagement && (
              <TableHeading
                ascending={currentSort.ascending}
                sortName="status"
                onClick={sortByStatus}
                marketSort={marketSort}
                setMarketSort={setMarketSort}
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
                className="gap-x-2 border-y border-white/15 child:pl-3"
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
                  <div className="flex-column flex">
                    <p className="w-[48px]">{quoteLogo(market)}</p>
                    <p className="pl-4">{market.quoteToken.symbol}</p>
                  </div>
                </TableCell>

                <TableCell className="flex flex-row py-6">
                  <CellLabel
                    logo={getTokenDetails(market?.payoutToken).logoUrl}
                    subContent={`(Market: ${market?.formattedFullPrice})`}
                  >
                    {market?.formattedDiscountedPrice}
                  </CellLabel>
                </TableCell>

                <TableCell
                  className={`${
                    market.discount > 0 ? "text-light-success" : "text-red-300"
                  }`}
                >
                  {market.discount}%
                </TableCell>

                <TableCell>
                  <CellLabel subContent={`(${market.formattedMaxPayoutUsd})`}>
                    {market.maxPayout} {market.payoutToken.symbol}
                  </CellLabel>
                </TableCell>

                <TableCell>{market.formattedShortVesting}</TableCell>

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

export const MarketListV3: FC<MarketListProps> = ({
  allowManagement,
  ...props
}) => {
  const navigate = useNavigate();
  const { getTokenDetails } = useTokens();
  const { refetchOne, allMarkets, isLoading } = useMarkets();
  const [marketSort, setMarketSort] = useAtom(sortAtom);

  const markets = props.markets || allMarkets;

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
      numericSort(m1.maxPayoutUsd, m2.maxPayoutUsd, ascending)
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

  const quoteLogo = (market: CalculatedMarket) => {
    if (
      "lpPair" in market.quoteToken &&
      market.quoteToken.lpPair != undefined
    ) {
      const token0 = getTokenDetails(market.quoteToken.lpPair.token0).logoUrl;
      const token1 = getTokenDetails(market.quoteToken.lpPair.token1).logoUrl;

      return (
        <div className="flex flex-row">
          <img className="h-[32px] w-[32px]" src={token0} />
          <img
            className="ml-[-8px] flex h-[32px] w-[32px] self-end"
            src={token1}
          />
        </div>
      );
    } else {
      const quote = getTokenDetails(market.quoteToken).logoUrl;
      const payout = getTokenDetails(market.payoutToken).logoUrl;

      return (
        <div className="flex flex-row">
          <img className="h-[32px] w-[32px]" src={quote} />
          <img
            className="ml-[-8px] flex h-[16px] w-[16px] self-end"
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

  if (isLoading.market || isLoading.priceCalcs) {
    return <Loading content="markets" />;
  }

  if (
    Object.values(isLoading).some((loading) => loading) ||
    allMarkets.size === 0
  ) {
    return (
      <div className="flex flex-col">
        <div className="mt-20 text-center text-5xl uppercase leading-normal">
          No Bond Markets <br />
          are currently open
        </div>
        <div className="flex flex-col items-center justify-center pt-8">
          <a href={socials.discord} target="_blank">
            <Button>Join our Discord</Button>
          </a>
          <p className="pt-2 text-sm uppercase">for the latest updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <table className="w-full table-fixed font-jakarta child:pl-3">
        <col className="w-[12%]" />
        <col className="w-[10%]" />
        <col className="w-[12%]" />
        <col className="w-[10%]" />
        <col className="w-[12%]" />
        <col className="w-[12%]" />
        <col className="w-[10%]" />
        <col className="w-[2%]" />

        <thead>
          <tr className="border-y border-white/25 child:py-1 child:pl-3">
            <TableHeading
              ascending={currentSort.ascending}
              sortName="name"
              onClick={sortByQuoteToken}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              BOND
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="price"
              onClick={sortByPrice}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              PRICE
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="discount"
              onClick={sortByDiscount}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              DISCOUNT
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="maxPayout"
              onClick={sortByMaxPayout}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              MAX PAYOUT
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="vesting"
              onClick={sortByVesting}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              VESTING
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="creation"
              onClick={sortByCreation}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              CREATED
            </TableHeading>

            <TableHeading
              ascending={currentSort.ascending}
              sortName="tbv"
              onClick={sortByTbv}
              marketSort={marketSort}
              setMarketSort={setMarketSort}
            >
              TBV
            </TableHeading>
            <TableHeading />
            {allowManagement && (
              <TableHeading
                ascending={currentSort.ascending}
                sortName="status"
                onClick={sortByStatus}
                marketSort={marketSort}
                setMarketSort={setMarketSort}
              >
                STATUS
              </TableHeading>
            )}
          </tr>
        </thead>

        <tbody>
          {sortedMarkets.map((market: CalculatedMarket) => {
            return (
              <tr className="border-b border-white/15 child:my-auto child:pl-3">
                <TableCell>
                  <div className="flex-column flex">
                    <p className="w-[48px]">{quoteLogo(market)}</p>
                    <p className="pl-4">{market.quoteToken.symbol}</p>
                  </div>
                </TableCell>

                <TableCell className="flex flex-row py-6">
                  <CellLabel
                    logo={getTokenDetails(market?.payoutToken).logoUrl}
                    subContent={`(Market: ${market?.formattedFullPrice})`}
                  >
                    {market?.formattedDiscountedPrice}
                  </CellLabel>
                </TableCell>

                <TableCell
                  className={`${
                    market.discount > 0 ? "text-light-success" : "text-red-300"
                  }`}
                >
                  {market.discount}%
                </TableCell>

                <TableCell>
                  <CellLabel subContent={`(${market.formattedMaxPayoutUsd})`}>
                    {market.maxPayout} {market.payoutToken.symbol}
                  </CellLabel>
                </TableCell>

                <TableCell>{market.formattedShortVesting}</TableCell>

                <TableCell>
                  <p>{market.creationDate}</p>
                </TableCell>

                <TableCell>{market.formattedTbvUsd}</TableCell>
                {allowManagement && (
                  <TableCell>
                    {market && market.isLive ? "Live" : "Closed"}
                  </TableCell>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
