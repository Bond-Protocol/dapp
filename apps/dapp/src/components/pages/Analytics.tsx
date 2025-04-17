import { PageHeader } from "components/common";
import { ClosedMarketList } from "components/lists";
import { ProtocolMetrics } from "components/organisms/ProtocolMetrics";

export const Analytics = () => {
  return (
    <div id="__ANALYTICS_PAGE_" className="h-full">
      <PageHeader title="ANALYTICS" />
      <ProtocolMetrics />
      <ClosedMarketList />
    </div>
  );
};
