import { CalculatedMarket } from "@bond-protocol/contract-library";
import { createContext, useContext } from "react";
import { useLimitOrder } from "./use-limit-order";

export type ILimitOrderContext = ReturnType<typeof useLimitOrder>;

const LimitOrderContext = createContext<ILimitOrderContext>(
  {} as ILimitOrderContext
);

export const LimitOrderProvider = ({
  children,
  market,
}: {
  children: React.ReactNode;
  market: CalculatedMarket;
}) => {
  const order = useLimitOrder(market);

  return (
    <LimitOrderContext.Provider value={order}>
      {children}
    </LimitOrderContext.Provider>
  );
};

export const useLimitOrderForMarket = () => {
  return useContext(LimitOrderContext);
};
