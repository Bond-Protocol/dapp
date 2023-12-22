import { useState, createContext, useContext } from "react";
import { useAccount } from "wagmi";

import { dateMath, useNumericInput } from "ui";
import { CalculatedMarket } from "types";

import { calcDiscountPercentage } from "src/utils/calculate-percentage";

import { useOrderApi } from "./use-order-api";
import { orderService } from "services/order-service";
import { Order } from "src/types/openapi";
import { useLimitOrderList } from "./use-limit-order-list";
import { useLimitOrderAllowance } from "./use-limit-order-allowance";
import { useOrderService } from "./use-order-service";
import { formatUnits, parseUnits, toHex } from "viem";
import { useQuery } from "@tanstack/react-query";

export type ILimitOrderContext = {
  setMaxFee(value: number): any;
  allowance: ReturnType<typeof useLimitOrderAllowance> & {
    approveRequiredAmount: () => void;
  };
  orders: ReturnType<typeof useLimitOrderList>;
  market: CalculatedMarket;
  discount?: number;
  price?: string;
  expiry?: Date;
  amount?: string;
  payout?: string;
  maxFee?: number;
  setPrice: (args: any) => void;
  setExpiry: (date: Date) => void;
  setAmount: (value: any) => void;
  createOrder: () => Promise<unknown>;
};

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
  const { value: price, onChange: setPrice } = useNumericInput();
  const { value: amount, onChange: setAmount } = useNumericInput();
  const [expiry, setExpiry] = useState<Date>(dateMath.addDays(new Date(), 1));
  const [overriddenFee, setMaxFee] = useState<number>();
  const api = useOrderApi();
  const orders = useLimitOrderList(market);

  const { isTokenSupported } = useOrderService();

  const isSupported = isTokenSupported(market.quoteToken);

  const { data: maxFee } = useQuery({
    enabled: isSupported,
    queryKey: ["order-max-fee", market.marketId],
    queryFn: async () => {
      const response = await orderService.estimateFee(
        Number(market.chainId),
        market.marketId
      );

      const hexFee = BigInt(response.data);
      return Number(formatUnits(hexFee, market.quoteToken.decimals));
    },
  });

  const allowance = useLimitOrderAllowance(market, amount, orders.list);

  const { address } = useAccount();

  const discount = calcDiscountPercentage(market.fullPrice, Number(price));

  const payout = (
    (Number(amount) * (market?.quoteToken?.price ?? 0)) /
    Number(price)
  )
    .toFixed(market.payoutToken.decimals)
    .toString();

  const generateOrder = () => {
    if (!amount || !price || !expiry || !address)
      throw new Error("Missing properties for creating an order");

    const adjustedAmount = parseUnits(
      amount.toString(),
      market.quoteToken.decimals
    );

    const minAmountOut = parseUnits(payout, market.payoutToken.decimals);

    const fee = overriddenFee ?? maxFee ?? 0;

    const adjustedMaxFee = parseUnits(
      fee.toString(),
      market.quoteToken.decimals
    );

    const decimalValues = {
      amount: adjustedAmount,
      min_amount_out: minAmountOut,
      deadline: Math.round(expiry.getTime() / 1000),
      submitted: Math.round(new Date().getTime() / 1000),
      max_fee: adjustedMaxFee,
    };

    const hexValues = Object.fromEntries(
      Object.entries(decimalValues).map(([key, value]) => [key, toHex(value)])
    );

    //@ts-ignore TODO: update Order market_id to number openyaml
    return {
      ...hexValues,
      market_id: Number(market.marketId),
      recipient: address,
      user: address,
      referrer: address,
    } as Order;
  };

  const createOrder = async () => {
    await api.createOrder(generateOrder(), Number(market.chainId));

    //Reload orders to show newly created one
    await orders.query.refetch();
  };

  const updateExpiry = (expiry: number | Date) => {
    const date =
      typeof expiry === "number"
        ? dateMath.addDays(new Date(), expiry)
        : expiry;

    setExpiry(date);
  };

  const approveRequiredAmount = () => {
    return allowance.execute();
  };

  const order = {
    allowance: {
      ...allowance,
      approveRequiredAmount,
    },
    discount,
    price,
    expiry,
    amount,
    payout,
    maxFee: overriddenFee || maxFee,
    setMaxFee,
    setPrice,
    setExpiry: updateExpiry,
    setAmount,
    createOrder,
    orders,
    market,
  };

  return (
    <LimitOrderContext.Provider value={order}>
      {children}
    </LimitOrderContext.Provider>
  );
};

export const useLimitOrderForMarket = () => {
  return useContext(LimitOrderContext);
};
