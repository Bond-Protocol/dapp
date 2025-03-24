import { PageHeader } from "components/common";
import { RequiresAuth } from "components/modules/limit-order";
import { LimitOrderFullList } from "components/modules/limit-order/LimitOrderFullList";
import { UserBonds } from "components/organisms/UserBonds";
import { UserMarkets } from "components/organisms/UserMarkets";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { featureToggles } from "src/feature-toggles";
import { Tabs } from "ui";

const tabs = [{ label: "My bonds" }, { label: "My Markets" }];
const orderTabs = [...tabs, { label: "My Orders" }];

export const Dashboard = () => {
  return (
    <div id="__DASHBOARD_PAGE__" className="h-full min-h-[90vh]">
      <PageHeader title={"DASHBOARD"} />
      <RequiresWallet>
        <Tabs
          tabs={featureToggles.LIMIT_ORDERS ? orderTabs : tabs}
          className="mt-10 pb-20"
        >
          <UserBonds />
          <UserMarkets />

          {featureToggles.LIMIT_ORDERS && (
            <div className="mt-10">
              <RequiresAuth title="Sign in to see your orders">
                <LimitOrderFullList />
              </RequiresAuth>
            </div>
          )}
        </Tabs>
      </RequiresWallet>
    </div>
  );
};
