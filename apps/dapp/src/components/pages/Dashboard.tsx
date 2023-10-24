import { PageHeader } from "components/common";
import { RequiresAuth } from "components/modules/limit-order";
import { LimitOrderFullList } from "components/modules/limit-order/LimitOrderFullList";
import { UserBonds } from "components/organisms/UserBonds";
import { UserMarkets } from "components/organisms/UserMarkets";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { useDashboard } from "context/dashboard-context";
import { useMediaQueries } from "hooks/useMediaQueries";
import { Tabs } from "ui";

const tabs = [
  { label: "My bonds" },
  { label: "My Orders" },
  { label: "My Markets" },
];

export const Dashboard = () => {
  const { isTabletOrMobile } = useMediaQueries();
  const dashboard = useDashboard();
  const hasMarkets = !!dashboard.allMarkets.length;

  return (
    <div className="h-full min-h-[90vh]">
      <PageHeader title={"DASHBOARD"} />
      <RequiresWallet>
        <Tabs tabs={tabs} className="mt-10 pb-20">
          <UserBonds />
          <RequiresAuth title="Sign in to see your orders">
            <LimitOrderFullList />
          </RequiresAuth>
          <UserMarkets />
        </Tabs>
      </RequiresWallet>
    </div>
  );
};
