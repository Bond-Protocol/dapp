import { useMarkets } from "context/market-context";
import { Filter, PaginatedTable } from "ui";
import { viewColumn } from "./columns";
import { pastMarketColumns } from "./UserMarketList";

const columnFilters = ["capacity"];

const tableColumns = [...pastMarketColumns, viewColumn]
  .map((col) => ({
    ...col,
    width: "w-full",
    alignEnd: col.accessor === "view",
  }))
  .filter((c) => !columnFilters.includes(c.accessor));

const filters: Filter[] = [
  {
    type: "switch",
    id: "knownValue",
    label: "Hide unknown value",
    startActive: true,
    handler: (cell) => {
      const market = cell;
      return market?.total?.quoteUsd && market?.total?.payoutUsd;
    },
  },
];
export const PastMarketList = () => {
  const { closedMarkets } = useMarkets();

  return (
    <PaginatedTable
      filters={filters}
      title="Past Markets"
      defaultSort="conclusion"
      columns={tableColumns}
      data={closedMarkets}
    />
  );
};
