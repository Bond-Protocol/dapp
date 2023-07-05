import { BondList } from "components/lists";
import { useDashboard } from "context/dashboard-context";

export const EmbeddedDashboard = () => {
  const dashboard = useDashboard();

  return (
    <div>
      <BondList disableSearch data={dashboard.ownerBalances} />
    </div>
  );
};
