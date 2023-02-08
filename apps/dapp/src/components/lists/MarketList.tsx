import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalculatedMarket,
  PrecalculatedMarket,
} from "@bond-protocol/contract-library";
import { Loading, Table } from "ui";
import { useLoadMarkets, useMarkets } from "hooks";
import { toTableData } from "src/utils/table";
import { meme } from "src/utils/words";
import {
  marketList as tableColumns,
  issuerMarketList as issuerColumns,
} from "./columns";
import { getProtocol } from "@bond-protocol/bond-library";

type MarketListProps = {
  markets?: Map<string, CalculatedMarket>;
  issuer?: string;
  allowManagement?: boolean;
  filter?: string[];
};

function formatMarket(market: PrecalculatedMarket) {
  return {
    id: market.id,
    chainId: market.chainId,
    auctioneer: market.auctioneer,
    teller: market.teller,
    marketId: Number(market.id.slice(market.id.lastIndexOf("_") + 1)),
    discount: 0,
    discountedPrice: 0,
    formattedDiscountedPrice: "",
    fullPrice: 0,
    formattedFullPrice: "",
    maxAmountAccepted: "",
    maxPayout: "0",
    maxPayoutUsd: 0,
    ownerBalance: "",
    ownerAllowance: "",
    formattedMaxPayoutUsd: "",
    vesting: market.vesting,
    vestingType: market.vestingType,
    formattedLongVesting: "",
    formattedShortVesting: "",
    currentCapacity: 0,
    capacityToken: "",
    owner: market.owner,
    quoteToken: market.quoteToken,
    payoutToken: market.payoutToken,
    isLive: false,
    isInstantSwap: market.isInstantSwap,
    totalBondedAmount: market.totalBondedAmount,
    totalPayoutAmount: market.totalPayoutAmount,
    tbvUsd: 0,
    formattedTbvUsd: "",
    creationBlockTimestamp: market.creationBlockTimestamp,
    creationDate: "",
  };
}

export const MarketList: FC<MarketListProps> = ({
  allowManagement,
  issuer,
  ...props
}) => {
  const navigate = useNavigate();
  //const { allMarkets, isLoading } = useMarkets();
  const { markets: prePriceMarkets, isLoading } = useLoadMarkets();
  console.log({ prePriceMarkets });

  const columns = issuer ? issuerColumns : tableColumns;

  // const markets = props.markets || prePriceMarkets;

  // const filteredMarkets = Array.from(markets.values()).filter((m) =>
  //   issuer ? getProtocol(m.owner)?.id === issuer : true
  // );

  // const tableMarkets = useMemo(
  //   () =>
  //     filteredMarkets
  //       .map((m) => toTableData(columns, m))
  //       .map((row) => {
  //         //@ts-ignore
  //         row["view"].onClick = (path: string) => navigate(path);
  //         //@ts-ignore (TODO): Improve this
  //         row.onClick = () =>
  //           navigate(`/market/${row?.view?.subtext}/${row?.view.value}`);
  //         return row;
  //       }),
  //   [allMarkets, isLoading, issuer, columns]
  // );
  const tableMarkets = useMemo(
    function () {
      //@ts-ignore
      return prePriceMarkets.map((market) =>
        toTableData(columns, formatMarket(market))
      );
    },
    [prePriceMarkets, isLoading]
  );

  const isSomeLoading = Object.values(isLoading).some((loading) => loading);

  if (isSomeLoading) {
    return <Loading content={meme()} />;
  }

  return <Table defaultSort="discount" columns={columns} data={tableMarkets} />;
};
