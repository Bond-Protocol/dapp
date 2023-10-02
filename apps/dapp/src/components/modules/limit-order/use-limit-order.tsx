import { useState, createContext, useContext, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";

import { dateMath, useNumericInput } from "ui";
import { CalculatedMarket } from "@bond-protocol/contract-library";

import { useTokenAllowance } from "hooks/useTokenAllowance";
import { providers } from "services/owned-providers";
import { calcDiscountPercentage } from "src/utils/calculate-percentage";
import { toHex } from "src/utils/bignumber";

import { useOrderApi } from "./use-order-api";
import { orderService } from "services/order-service";
import { formatUnits } from "ethers/lib/utils.js";

export type ILimitOrderContext = {
  allowance: ReturnType<typeof useTokenAllowance>;
  discount: number;
  price: string;
  expiry: Date;
  amount: string;
  payout: string;
  fee: string;
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
  const [amount, setAmount] = useState<string>("");
  const [expiry, setExpiry] = useState<Date>(dateMath.addDays(new Date(), 1));
  const [fee, setFee] = useState<string>("");
  const api = useOrderApi(market);

  const provider = providers[market.chainId];
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const allowance = useTokenAllowance(
    address ?? "",
    market.quoteToken.address,
    market.quoteToken.decimals,
    market.chainId,
    market.auctioneer,
    amount?.toString() ?? "",
    provider,
    signer!
  );

  const discount = calcDiscountPercentage(market.fullPrice, Number(price));
  const payout = (
    (Number(amount) * (market?.quoteToken?.price ?? 0)) /
    Number(price)
  ).toString();

  useEffect(() => {
    async function estimateFee() {
      //TODO: check if right value when the setup is complete
      const response = await orderService.estimateFee(
        Number(market.chainId),
        market.marketId
      );

      const fee = formatUnits(response.data, market.quoteToken.decimals);
      setFee(fee);
    }

    estimateFee();
  }, []);

  const generateOrder = () => {
    if (!amount || !price || !expiry || !address)
      throw new Error("Missing properties for creating an order");

    const adjustedAmount = ethers.utils.parseUnits(
      amount.toString(),
      market.quoteToken.decimals
    );

    const minAmountOut = ethers.utils.parseUnits(
      payout.toString(),
      market.payoutToken.decimals
    );

    const decimalValues = {
      amount: adjustedAmount,
      min_amount_out: minAmountOut,
      deadline: expiry.getTime(),
      submitted: new Date().getTime(),
      max_fee: "1",
    };

    return {
      ...toHex(decimalValues),
      market_id: market.marketId,
      recipient: address,
      user: address,
      referrer: address,
    };
  };

  const createOrder = async () => {
    return api.createOrder(generateOrder());
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
    fee,
    setPrice,
    setExpiry: updateExpiry,
    setAmount,
    createOrder,
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
