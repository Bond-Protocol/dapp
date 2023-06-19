import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { FallbackProps, Filter, PaginatedTable } from "ui";
import { useMarkets } from "hooks";
import {
  marketList as tableColumns,
  tokenMarketList as tokenColumns,
} from "./columns";

type MarketListProps = {
  markets?: CalculatedMarket[];
  token?: string;
  allowManagement?: boolean;
  filter?: string[];
  filterText?: string;
  hideSearchbar?: boolean;
};

const filters: Filter[] = [
  {
    id: "discount",
    label: "Hide Premium bonds",
    type: "switch",
    handler: (market: CalculatedMarket) => {
      return Number(market.discount) > 0;
    },
  },
];

export const MarketList: FC<MarketListProps> = ({
  allowManagement,
  token,
  ...props
}) => {
  const navigate = useNavigate();
  const { allMarkets, isLoading } = useMarkets();
  const markets = props.markets || allMarkets;

  const columns = token ? tokenColumns : tableColumns;

  const filteredMarkets = markets.filter((m: CalculatedMarket) =>
    token ? m.payoutToken.address === token : true
  );

  const isSomeLoading = Object.values(isLoading).some((loading) => loading);

  return (
    <PaginatedTable
      loading={isSomeLoading}
      hideSearchbar={props.hideSearchbar}
      filterText={props.filterText}
      defaultSort="discount"
      columns={columns}
      filters={filters}
      data={filteredMarkets}
      onClickRow={(market: CalculatedMarket) =>
        navigate(`/market/${market.chainId}/${market.marketId}`)
      }
      fallback={{
        title: "NO MARKETS CURRENTLY AVAILABLE",
        buttonText: "Deploy a new market",
        onClick: () => navigate("/create"),
      }}
    />
  );
};
