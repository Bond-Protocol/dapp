import { useMarkets } from "context/market-context";
import { Filter, PaginatedTable } from "ui";
import { pastMarketColumns } from "./UserMarketList";

const tableColumns = pastMarketColumns.map((t) => ({
  ...t,
  width: "w-full",
}));

const filters: Filter[] = [
  {
    type: "switch",
    id: "knownValue",
    label: "Show unknown value",
    handler: (args) => {
      console.log({ args });

      return true;
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
