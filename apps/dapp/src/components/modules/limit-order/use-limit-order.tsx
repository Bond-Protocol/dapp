import { useState, createContext, useContext, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";

import { dateMath, useNumericInput } from "ui";
import {
  CalculatedMarket,
  getAddresses,
} from "@bond-protocol/contract-library";

import { useTokenAllowance } from "hooks/useTokenAllowance";
import { providers } from "services/owned-providers";
import { calcDiscountPercentage } from "src/utils/calculate-percentage";
import { toHex } from "src/utils/bignumber";

import { useOrderApi } from "./use-order-api";
import { orderService } from "services/order-service";
import { Order } from "src/types/openapi";
import { useLimitOrderList } from "./use-limit-order-list";

export type ILimitOrderContext = {
  allowance: ReturnType<typeof useTokenAllowance>;
  orders: ReturnType<typeof useLimitOrderList>;
  market: CalculatedMarket;
  discount?: number;
  price?: string;
  expiry?: Date;
  amount?: string;
  payout?: string;
  maxFee?: number;
  setPrice: (e: React.BaseSyntheticEvent<HTMLInputElement>) => void;
  setExpiry: (date: Date) => void;
  setAmount: (value: string) => void;
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
  const [amount, setAmount] = useState<string>();
  const [expiry, setExpiry] = useState<Date>(dateMath.addDays(new Date(), 1));
  const [maxFee, setMaxFee] = useState<number>();
  const api = useOrderApi();
  const orders = useLimitOrderList(market);

  const provider = providers[market.chainId];
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const allowance = useTokenAllowance(
    address ?? "",
    market.quoteToken.address,
    market.quoteToken.decimals,
    market.chainId,
    getAddresses(market.chainId).settlement,
    amount?.toString() ?? "0",
    provider,
    signer!,
    true
  );

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

    const adjustedAmount = ethers.utils.parseUnits(
      amount.toString(),
      market.quoteToken.decimals
    );

    const minAmountOut = ethers.utils.parseUnits(
      payout,
      market.payoutToken.decimals
    );

    const adjustedMaxFee = ethers.utils.parseUnits(
      maxFee?.toString() ?? "0",
      market.quoteToken.decimals
    );

    const decimalValues = {
      amount: adjustedAmount,
      min_amount_out: minAmountOut,
      deadline: Math.round(expiry.getTime() / 1000),
      submitted: Math.round(new Date().getTime() / 1000),
      max_fee: adjustedMaxFee,
    };

    //@ts-ignore TODO: update Order market_id to number openyaml
    return {
      ...toHex(decimalValues),
      market_id: Number(market.marketId),
      recipient: address,
      user: address,
      referrer: address,
    } as Order;
  };

  useEffect(() => {
    const estimateFee = async () => {
      const response = await orderService.estimateFee(
        Number(market.chainId),
        market.marketId
      );

      let hexFee = BigNumber.from(response.data);
      let fee = Number(
        ethers.utils.formatUnits(hexFee, market.quoteToken.decimals)
      );
      setMaxFee(fee);
    };
    estimateFee();
  }, []);

  const createOrder = async () => {
    return api.createOrder(generateOrder(), Number(market.chainId));
  };

  const updateExpiry = (expiry: number | Date) => {
    const date =
      typeof expiry === "number"
        ? dateMath.addDays(new Date(), expiry)
        : expiry;

    setExpiry(date);
  };

  const order = {
    allowance,
    discount,
    price,
    expiry,
    amount,
    payout,
    maxFee,
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
