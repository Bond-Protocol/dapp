import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useTokenAllowance } from "hooks/useTokenAllowance";
import { useAccount, useSigner } from "wagmi";
import { providers } from "services/owned-providers";
import { useState } from "react";
import { calcDiscountPercentage } from "src/utils/calculate-percentage";
import { dateMath, useNumericInput } from "ui";
import { useOrderApi } from "services/limit-order/use-order-api";
import { BigNumber } from "ethers";
import { toHex } from "src/utils/bignumber";

export const useLimitOrder = (market: CalculatedMarket) => {
  const { value: price, onChange: setPrice } = useNumericInput();
  const [amount, setAmount] = useState<string>();
  const [expiry, setExpiry] = useState<Date>(dateMath.addDays(new Date(), 1));
  const api = useOrderApi();

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
  const payout =
    (Number(amount) * (market?.quoteToken?.price ?? 0)) / Number(price);

  const createOrder = async () => {
    if (!amount || !price || !expiry || !address)
      throw new Error("Missing properties for creating an order");

    const values = {
      market_id: String(market.marketId),
      amount: amount.toString(),
      min_amount_out: payout.toFixed(0),
      deadline: expiry.getTime().toString(),
      submitted: new Date().getTime().toString(),
      max_fee: "1",
    };

    const hexed = {
      ...toHex(values),
      recipient: address,
      user: address,
      referrer: address,
    };

    console.log({ hexed });
    const response = await api.createOrder(hexed);

    console.log({ res: response });
  };

  const updateExpiry = (expiry: number | Date) => {
    const date =
      typeof expiry === "number"
        ? dateMath.addDays(new Date(), expiry)
        : expiry;

    setExpiry(date);
  };

  return {
    allowance,
    discount,
    price,
    expiry,
    amount,
    payout,
    setPrice,
    setExpiry: updateExpiry,
    setAmount,
    createOrder,
  };
};
