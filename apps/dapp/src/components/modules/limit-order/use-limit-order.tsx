import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useTokenAllowance } from "hooks/useTokenAllowance";
import { useAccount, useSigner } from "wagmi";
import { providers } from "services/owned-providers";
import { useState } from "react";
import { calcDiscountPercentage } from "src/utils/calculate-percentage";
import { useNumericInput } from "ui";

export const useLimitOrder = (market: CalculatedMarket) => {
  const { value: price, onChange: setPrice } = useNumericInput();
  //const { value: amount, onChange: setAmount } = useNumericInput();
  const [amount, setAmount] = useState();
  const [expiry, setExpiry] = useState(1);

  const provider = providers[market.chainId];
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const allowance = useTokenAllowance(
    address ?? "",
    market.quoteToken.address,
    market.quoteToken.decimals,
    market.chainId,
    market.auctioneer,
    amount ?? "",
    provider,
    signer!
  );

  const discount = calcDiscountPercentage(market.fullPrice, Number(price));
  const payout =
    ((amount ?? 0) * (market?.quoteToken?.price ?? 0)) / Number(price);

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
  };
};
