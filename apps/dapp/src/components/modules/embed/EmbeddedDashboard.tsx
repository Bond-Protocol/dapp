import { BondList } from "components/lists";
import { useDashboard } from "hooks";

export const EmbeddedDashboard = () => {
  const dashboard = useDashboard();

  return (
    <div>
      <BondList disableSearch data={dashboard.ownerBalances} />
    </div>
  );
};
