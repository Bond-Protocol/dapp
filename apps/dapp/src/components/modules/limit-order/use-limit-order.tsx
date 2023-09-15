import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useTokenAllowance } from "hooks/useTokenAllowance";
import { useAccount, useSigner } from "wagmi";
import { providers } from "services/owned-providers";
import { useState } from "react";
import { calcDiscountPercentage } from "src/utils/calculate-percentage";
import { dateMath, useNumericInput } from "ui";
import { useOrderApi } from "services/limit-order/use-order-api";
import { BigNumber } from "ethers";

export const useLimitOrder = (market: CalculatedMarket) => {
  const { value: price, onChange: setPrice } = useNumericInput();
  //const { value: amount, onChange: setAmount } = useNumericInput();
  const [amount, setAmount] = useState<string>();
  const [expiry, setExpiry] = useState<number>();
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
    ((amount ?? 0) * (market?.quoteToken?.price ?? 0)) / Number(price);

  const createOrder = async () => {
    console.log("UselimitOrder-CreateOrder");
    console.log({ amount, price, expiry, address });
    if (!amount || !price || !expiry || !address)
      throw new Error("Missing properties for creating an order");

    const res = await api.createOrder({
      market_id: String(market.marketId),
      amount: amount.toString(),
      min_amount_out: BigNumber.from(amount).toString(),
      recipient: address,
      user: address,
      referrer: address,
      max_fee: "1",
      deadline: dateMath.addDays(new Date(), expiry).getTime().toString(),
    });
    console.log({ res });
  };

  return {
    allowance,
    discount,
    price,
    expiry,
    amount,
    payout,
    setPrice,
    setExpiry,
    setAmount,
    createOrder,
  };
};
