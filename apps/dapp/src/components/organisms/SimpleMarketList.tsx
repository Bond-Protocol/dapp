import { FC, useEffect, useRef, useState } from "react";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import {
  ExpandableRow,
  TableHeading,
  CellLabel,
  TableCell,
  Loading,
  BondDetails,
} from "ui";
import { useMarkets, useTokens } from "hooks";
import { providers } from "services/owned-providers";
import {
  CHAINS,
  getProtocolByAddress,
  NativeCurrency,
} from "@bond-protocol/bond-library";

type SimpleMarketListProps = {
  markets?: Map<string, CalculatedMarket>;
};

const REFERRAL_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;
const NO_REFERRAL_ADDRESS = "0x0000000000000000000000000000000000000000";
const NO_FRONTEND_FEE_OWNERS = import.meta.env.VITE_NO_FRONTEND_FEE_OWNERS;

export const SimpleMarketList: FC<SimpleMarketListProps> = ({ ...props }) => {
  const { getTokenDetails } = useTokens();
  const { refetchOne, allMarkets, isLoading } = useMarkets();
  const { getPrice } = useTokens();

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
      </div>
    );
  }

  return (
    <div className="pt-10">
      <table className="w-full table-fixed font-jakarta">
        <thead>
          <tr className="border-b border-white/60 child:pl-2">
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
          </tr>
        </thead>

        <tbody>
          {sortedMarkets.map((market: CalculatedMarket) => {
            const protocol = getProtocolByAddress(market.owner, market.network);

            const nativeCurrency: NativeCurrency = CHAINS.get(market.network)
              ?.nativeCurrency || {
              decimals: 18,
              name: "Ethereum",
              symbol: "ETH",
            };

            const nativeCurrencyPrice = getPrice(nativeCurrency.symbol);

            const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
              market.network.concat("_").concat(market.owner)
            )
              ? NO_REFERRAL_ADDRESS
              : REFERRAL_ADDRESS;

            return (
              <ExpandableRow
                key={market.id}
                className="gap-x-2 border-y border-white/15 child:pl-2"
                onOpen={() => {
                  timerRef.current = setInterval(() => {
                    refetchOne(market.id);
                  }, 13 * 1000);
                }}
                onClose={() => clearInterval(timerRef.current)}
                expanded={
                  <div className="w-[100vw] max-w-[1440px] py-8">
                    <BondDetails
                      market={market}
                      nativeCurrency={nativeCurrency}
                      nativeCurrencyPrice={nativeCurrencyPrice}
                      referralAddress={referralAddress}
                      issuerName={protocol?.name || "BondProtocol"}
                      provider={providers[market.network]}
                      // @ts-ignore
                      signer={signer}
                    />
                  </div>
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
              </ExpandableRow>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
