import { createContext, useContext } from "react";
import { useSubgraphLoader } from "services/use-subgraph-loader";

const initialState = {
  totalPurchases: [],
  uniqueBonders: [],
  subgraphTokens: [],
  markets: [],
  isLoading: false,
};

export const SubgraphContext = createContext(initialState);

export const useSubgraph = () => {
  return useContext(SubgraphContext);
};

export const SubgraphProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const subgraphData = useSubgraphLoader();

  return (
    // @ts-ignore
    <SubgraphContext.Provider value={subgraphData}>
      {children}
    </SubgraphContext.Provider>
  );
};
