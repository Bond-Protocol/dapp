import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { Loading, Table } from "ui";
import { useMarkets } from "hooks";
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

export const MarketList: FC<MarketListProps> = ({
  allowManagement,
  issuer,
  ...props
}) => {
  const navigate = useNavigate();
  const { allMarkets, isLoading } = useMarkets();

  const columns = issuer ? issuerColumns : tableColumns;

  const markets = props.markets || allMarkets;

  const filteredMarkets = Array.from(markets.values()).filter((m) =>
    issuer ? getProtocol(m.owner)?.id === issuer : true
  );

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
    [allMarkets, isLoading, issuer, columns]
  );

  const isSomeLoading = Object.values(isLoading).some((loading) => loading);

  if (isSomeLoading) {
    return <Loading content={meme()} />;
  }

  return <Table defaultSort="discount" columns={columns} data={tableMarkets} />;
};
