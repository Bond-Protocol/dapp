import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { Loading, PaginatedTable } from "ui";
import { useMarkets } from "hooks";
import { toTableData } from "src/utils/table";
import { meme } from "src/utils/words";
import {
  marketList as tableColumns,
  tokenMarketList as tokenColumns,
} from "./columns";

type MarketListProps = {
  markets?: Map<string, CalculatedMarket>;
  token?: string;
  allowManagement?: boolean;
  filter?: string[];
  filterText?: string;
  hideSearchbar?: boolean;
};

export const MarketList: FC<MarketListProps> = ({
  allowManagement,
  token,
  ...props
}) => {
  const navigate = useNavigate();
  const { allMarkets, isLoading } = useMarkets();

  const columns = token ? tokenColumns : tableColumns;

  const markets = props.markets || allMarkets;

  const filteredMarkets = Array.from(markets.values())
    .filter((m) => (token ? m.payoutToken.address === token : true))
    .sort((a, b) => b.discount - a.discount);

  const tableMarkets = useMemo(
    () =>
      filteredMarkets
        .map((m) => toTableData(columns, m))
        .map((row) => {
          //@ts-ignore
          row["view"].onClick = (path: string) => navigate(path);
          //@ts-ignore (TODO): Improve this
          row.onClick = () =>
            navigate(`/market/${row?.view?.subtext}/${row?.view.value}`);
          return row;
        }),
    [allMarkets, isLoading, token, columns]
  );

  const isSomeLoading = Object.values(isLoading).some((loading) => loading);

  if (isSomeLoading) {
    return <Loading content={meme()} />;
  }

  return (
    <PaginatedTable
      hideSearchbar={props.hideSearchbar}
      filterText={props.filterText}
      defaultSort="discount"
      columns={columns}
      data={tableMarkets}
    />
  );
};
