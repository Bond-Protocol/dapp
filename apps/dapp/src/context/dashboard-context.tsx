import { createContext, useContext } from "react";
import { useDashboardLoader } from "services/use-dashboard-loader";

const initialState = {
  ownerBalances: [],
  bondPurchases: [],
  currentMarkets: [],
  closedMarkets: [],
  isLoading: false,
};

export const DashboardContext = createContext(initialState);

export const useDashboard = () => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dashboardData = useDashboardLoader();

  return (
    // @ts-ignore
    <DashboardContext.Provider value={dashboardData}>
      {children}
    </DashboardContext.Provider>
  );
};
