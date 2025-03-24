import { useMarkets } from "hooks";
import { Filter, PaginatedTable } from "ui";
import { viewColumn } from "./columns";
import { closedMarketColumns } from "./UserMarketList";

const columnFilters = ["capacity"];

const tableColumns = [...closedMarketColumns, viewColumn]
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

export const ClosedMarketList = () => {
  const { closedMarkets } = useMarkets();

  return (
    <PaginatedTable
      hideSearchbar
      title="Past Markets"
      defaultSort="conclusion"
      columns={tableColumns}
      data={closedMarkets}
    />
  );
};
