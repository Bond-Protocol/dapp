import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { Filter, PaginatedTable } from "ui";
import { useMarkets, useMediaQueries } from "hooks";
import {
  marketList as tableColumns,
  tokenMarketList as tokenColumns,
  mobileMarketLIst as mobileColumns,
} from "./columns";

type MarketListProps = {
  markets?: CalculatedMarket[];
  token?: string;
  allowManagement?: boolean;
  filter?: string[];
  filterText?: string;
  hideSearchbar?: boolean;
  title?: string;
};

const defaultFilters: Filter[] = [
  {
    id: "discount",
    label: "Hide Negative Discounts",
    type: "switch",
    handler: (market: CalculatedMarket) =>
      Number(market.discount) >= 0 || isNaN(market.discount),
  },
  {
    id: "unknown",
    label: "Hide Unknown Discounts",
    type: "switch",
    handler: (market: CalculatedMarket) => !isNaN(market.discount),
  },
];

export const MarketList: FC<MarketListProps> = ({
  allowManagement,
  token,
  ...props
}) => {
  const { isTabletOrMobile } = useMediaQueries();
  const navigate = useNavigate();
  const { allMarkets, isLoading } = useMarkets();
  const markets = props.markets || allMarkets;

  const columns = token ? tokenColumns : tableColumns;

  const filteredMarkets = markets.filter((m: CalculatedMarket) =>
    token ? m.payoutToken.address === token : true
  );

  const isSomeLoading = Object.values(isLoading).some((loading) => loading);

  const fallback = {
    title: "NO MARKETS CURRENTLY AVAILABLE",
    buttonText: "Deploy a new market",
    onClick: () => navigate("/create"),
  };

  const filters = defaultFilters;

  return (
    <PaginatedTable
      title={props.title}
      loading={isSomeLoading}
      hideSearchbar={props.hideSearchbar || isTabletOrMobile}
      filterText={props.filterText}
      defaultSort="discount"
      columns={isTabletOrMobile ? mobileColumns : columns}
      filters={filters}
      data={filteredMarkets}
      onClickRow={(market: CalculatedMarket) => {
        window.scrollTo(0, 0);
        navigate(`/market/${market.chainId}/${market.marketId}`);
      }}
      fallback={isTabletOrMobile ? { title: fallback.title } : fallback}
    />
  );
};
