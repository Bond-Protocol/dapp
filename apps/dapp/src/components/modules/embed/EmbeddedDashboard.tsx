import { BondList } from "components/lists";
import { UserBonds } from "components/organisms/UserBonds";
import { useDashboard } from "context/dashboard-context";

export const EmbeddedDashboard = () => {
  const dashboard = useDashboard();

  return (
    <div>
      <BondList disableSearch data={dashboard.ownerBalances} />
    </div>
  );
};
