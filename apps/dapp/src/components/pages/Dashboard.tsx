import { PageHeader } from "components/common";
import { UserBonds } from "components/organisms/UserBonds";
import { UserMarkets } from "components/organisms/UserMarkets";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { Tabs } from "ui";

export const Dashboard = () => {
  const tabs = [
    { label: "My bonds", id: 0 },
    { label: "My Markets", id: 1 },
  ];

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
