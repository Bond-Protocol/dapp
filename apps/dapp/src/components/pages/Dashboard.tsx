import { PageHeader } from "components/common";
import { UserBonds } from "components/organisms/UserBonds";
import { UserMarkets } from "components/organisms/UserMarkets";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { Tabs } from "ui";

const tabs = [{ label: "My bonds" }, { label: "My Markets" }];

export const Dashboard = () => {
  return (
    <>
      <PageHeader title={"DASHBOARD"} />
      <RequiresWallet>
        <Tabs tabs={tabs} className="pb-20">
          <UserBonds />
          <UserMarkets />
        </Tabs>
      </RequiresWallet>
    </>
  );
};
