import { CalculatedMarket } from "@bond-protocol/contract-library";
import { createContext, useContext } from "react";
import { useDashboardLoader } from "services/use-dashboard-loader";
import { BondPurchase, Market, OwnerBalance } from "src/generated/graphql";

const initialState = {
  ownerBalances: [],
  bondPurchases: [],
  currentMarkets: [],
  closedMarkets: [],
  bondsIssued: 0,
  uniqueBonders: 0,
  tbv: 0,
  userTbv: 0,
  claimableAmount: 0,
  isLoading: false,
};

interface IDashboardContext {
  ownerBalances: Partial<OwnerBalance>[];
  bondPurchases: BondPurchase[];
  currentMarkets: CalculatedMarket[];
  closedMarkets: Market[];
  bondsIssued: number;
  uniqueBonders: number;
  tbv: number;
  userTbv: number;
  claimableAmount: number;
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
