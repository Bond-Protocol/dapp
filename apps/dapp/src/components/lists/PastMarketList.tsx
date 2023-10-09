import { useMarkets } from "context/market-context";
import { PaginatedTable } from "ui";
import { pastMarketColumns } from "./UserMarketList";

const tableColumns = pastMarketColumns.map((t) => ({
  ...t,
  width: "w-full",
}));

export const PastMarketList = () => {
  const { closedMarkets } = useMarkets();

  return (
    <PaginatedTable
      title="Past Markets"
      defaultSort="conclusion"
      columns={tableColumns}
      data={closedMarkets}
    />
  );
};
