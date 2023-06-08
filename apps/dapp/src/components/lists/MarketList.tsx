import { FC } from "react";
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

  const filteredMarkets = markets
    // @ts-ignore
    .filter((m: CalculatedMarket) =>
      token ? m.payoutToken.address === token : true
    )
    .sort((a: CalculatedMarket, b: CalculatedMarket) => {
      let aDiscount = a.discount;
      let bDiscount = b.discount;

      if (isNaN(aDiscount) || aDiscount === Infinity || aDiscount === -Infinity)
        aDiscount = 0;
      if (isNaN(bDiscount) || bDiscount === Infinity || bDiscount === -Infinity)
        bDiscount = 0;
      return bDiscount - aDiscount;
    });

  const tableMarkets = filteredMarkets
    .map((m: CalculatedMarket) => toTableData(columns, m))
    .map((row: any) => {
      row["view"].onClick = (path: string) => navigate(path);
      row.onClick = () =>
        navigate(`/market/${row?.view?.subtext}/${row?.view.value}`);
      return row;
    });

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
