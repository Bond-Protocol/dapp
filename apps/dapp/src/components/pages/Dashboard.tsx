import { PageHeader } from "components/common";
import { UserBonds } from "components/organisms/UserBonds";
import { UserMarkets } from "components/organisms/UserMarkets";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { useDashboard } from "context/dashboard-context";
import { Tabs } from "ui";

export const Dashboard = () => {
  const dashboard = useDashboard();
  const tabs = [{ label: "My bonds" }, { label: "My Markets" }];

  const hasMarkets = !!dashboard.allMarkets.length;

  return (
    <>
      <PageHeader title={"DASHBOARD"} />
      <RequiresWallet>
        <Tabs tabs={hasMarkets ? tabs : [tabs[0]]} className="pb-20">
          <UserBonds />
          <UserMarkets />
        </Tabs>
      </RequiresWallet>
    </>
  );
};
