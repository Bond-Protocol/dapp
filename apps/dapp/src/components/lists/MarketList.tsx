import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/types";
import { Filter, PaginatedTable } from "ui";
import { useMarkets, useMediaQueries } from "hooks";
import {
  embedColumns,
  marketList as tableColumns,
  mobileMarketLIst as mobileColumns,
  tokenMarketList as tokenColumns,
} from "./columns";
import { useIsEmbed } from "hooks/useIsEmbed";

type MarketListProps = {
  owner?: string;
  markets?: CalculatedMarket[];
  token?: string;
  allowManagement?: boolean;
  filter?: string[];
  filterText?: string;
  hideSearchbar?: boolean;
  title?: string;
  filters?: Filter[];
  hideUnknownMarkets?: boolean;
};

function onlyKnownDiscount(market: CalculatedMarket) {
  return isFinite(market.discount);
}

export const MarketList: FC<MarketListProps> = ({
  allowManagement,
  token,
  filters = [],
  hideUnknownMarkets,
  ...props
}) => {
  const { isTabletOrMobile } = useMediaQueries();
  const navigate = useNavigate();
  const { allMarkets, getMarketsForOwner, isLoading } = useMarkets();
  const isEmbed = useIsEmbed();
  const markets = props.owner ? getMarketsForOwner(props.owner) : allMarkets;

  const filteredMarkets = markets
    .filter((m: CalculatedMarket) => !token || m.payoutToken.address === token)
    .filter((m) => !hideUnknownMarkets || onlyKnownDiscount(m));

  const isSomeLoading = Object.values(isLoading).some((loading) => loading);

  const fallback = {
    title: "NO MARKETS CURRENTLY AVAILABLE",
    buttonText: "Deploy a new market",
    onClick: () => navigate("/create"),
  };

  let columns = token ? tokenColumns : tableColumns;
  columns = isEmbed ? embedColumns : columns;
  columns = isTabletOrMobile ? mobileColumns : columns;

  return (
    <div className="flex flex-col">
      <PaginatedTable
        title={props.title}
        loading={isSomeLoading}
        hideSearchbar
        disableSearch
        defaultSort="discount"
        columns={columns}
        data={filteredMarkets}
        onClickRow={(market: CalculatedMarket) => {
          window.scrollTo(0, 0);
          navigate(
            `${isEmbed ? "/embed" : ""}/market/${market.chainId}/${
              market.marketId
            }`
          );
        }}
        fallback={
          isTabletOrMobile || isEmbed ? { title: fallback.title } : fallback
        }
      />
    </div>
  );
};
