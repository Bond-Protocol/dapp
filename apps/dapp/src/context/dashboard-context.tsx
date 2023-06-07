import { CalculatedMarket } from "@bond-protocol/contract-library";
import { createContext, useContext } from "react";
import { useDashboardLoader } from "services/use-dashboard-loader";
import { BondPurchase, Market, OwnerBalance } from "src/generated/graphql";

const initialState = {
  ownerBalances: [],
  bondPurchases: [],
  currentMarkets: [],
  closedMarkets: [],
  isLoading: false,
};

interface IDashboardContext {
  ownerBalances: OwnerBalance[];
  bondPurchases: BondPurchase[];
  currentMarkets: CalculatedMarket[];
  closedMarkets: Market[];
  isLoading: boolean;
}

export const DashboardContext = createContext(
  initialState as IDashboardContext
);

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
    <DashboardContext.Provider value={dashboardData}>
      {children}
    </DashboardContext.Provider>
  );
};
