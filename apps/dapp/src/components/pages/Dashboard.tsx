import { PageHeader } from "components/common";
import { RequiresAuth } from "components/modules/limit-order";
import { LimitOrderFullList } from "components/modules/limit-order/LimitOrderFullList";
import { UserBonds } from "components/organisms/UserBonds";
import { UserMarkets } from "components/organisms/UserMarkets";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { useDashboard } from "hooks/useDashboard";
import { featureToggles } from "src/feature-toggles";
import { Tabs } from "ui";

const tabs = [{ label: "My bonds" }, { label: "My Markets" }];
const orderTabs = [...tabs, { label: "My Orders" }];

export const Dashboard = () => {
  const { isMarketOwner } = useDashboard();
  return (
    <div id="__DASHBOARD_PAGE__" className="h-full min-h-[90vh] ">
      <PageHeader title={"DASHBOARD"} className="mb-3" />
      <RequiresWallet>
        {isMarketOwner || featureToggles.LIMIT_ORDERS ? (
          <Tabs
            tabs={featureToggles.LIMIT_ORDERS ? orderTabs : tabs}
            className="mt-10 pb-20"
          >
            <UserBonds />
            {isMarketOwner && <UserMarkets />}

            {featureToggles.LIMIT_ORDERS && (
              <div className="mt-10">
                <RequiresAuth title="Sign in to see your orders">
                  <LimitOrderFullList />
                </RequiresAuth>
              </div>
            )}
          </Tabs>
        ) : (
          <UserBonds />
        )}
      </RequiresWallet>
    </div>
  );
};
