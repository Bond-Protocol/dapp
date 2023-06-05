import { CalculatedMarket } from "@bond-protocol/contract-library";
import { toTableData } from "src/utils/table";
import { Column, formatCurrency, formatDate, PaginatedTable } from "ui";
import { bondColumn, discountColumn, viewColumn } from "./columns";

export const tableColumns: Array<Column<CalculatedMarket>> = [
  bondColumn,
  {
    label: "Payout",
    accessor: "payout",
    formatter: (market) => {
      return {
        value: market.payoutToken.symbol,
        icon: market.payoutToken.logoURI,
      };
    },
  },
  {
    label: "Capacity",
    accessor: "capacity",
    formatter: (market) => {
      const total = formatCurrency.longFormatter.format(
        Number(market.totalPayoutAmount) + Number(market.currentCapacity)
      );
      const remaining = formatCurrency.longFormatter.format(
        market.currentCapacity
      );

      return {
        value: `${remaining} ${market.capacityToken}`,
        subtext: `Total: ${total} ${market.capacityToken}`,
      };
    },
  },
  {
    label: "Assets Received",
    accessor: "assets",
    formatter: (market) => {
      return {
        value:
          formatCurrency.longFormatter.format(market.totalBondedAmount) +
          " " +
          market.quoteToken.symbol,
        subtext: formatCurrency.usdFormatter.format(
          Number(market.formattedTbvUsd)
        ),
      };
    },
  },
  discountColumn,
  {
    label: "Expiry Date",
    accessor: "",
    formatter: (market) => {
      return {
        value: formatDate.short(new Date(Number(market.conclusion) * 1000)),
      };
    },
  },
  viewColumn,
];
export const UserMarketList = ({ data = [], ...props }: any) => {
  const tableData = data.map((b: any) => toTableData(tableColumns, b));

  return (
    <div className="mt-10">
      <PaginatedTable
        title="Markets"
        defaultSort="vesting"
        columns={tableColumns}
        data={tableData}
        Fallback={props.Fallback}
      />
    </div>
  );
};
