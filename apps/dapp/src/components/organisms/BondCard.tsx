import { FC } from "react";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { getProtocolByAddress } from "@bond-protocol/bond-library";
import { BondDiscountChart } from "components/organisms/BondDiscountChart";
import { providers } from "services/owned-providers";
import { useSigner } from "wagmi";
import { BondPurchaseCard } from "components/organisms";
import { useNativeCurrency } from "hooks/useNativeCurrency";

export type BondCardProps = {
  market: CalculatedMarket;
  className?: string;
};

const REFERRAL_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;
const NO_REFERRAL_ADDRESS = "0x0000000000000000000000000000000000000000";
const NO_FRONTEND_FEE_OWNERS = import.meta.env.VITE_NO_FRONTEND_FEE_OWNERS;

export const BondCard: FC<BondCardProps> = ({ market, ...props }) => {
  const protocol = getProtocolByAddress(market.owner, market.chainId);
  const { data: signer } = useSigner();

  const { nativeCurrency, nativeCurrencyPrice } = useNativeCurrency(
    market.chainId
  );

  const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
    market.chainId.concat("_").concat(market.owner)
  )
    ? NO_REFERRAL_ADDRESS
    : REFERRAL_ADDRESS;

  return (
    <div className={`flex gap-4 ${props.className}`}>
      <div className="flex w-1/2">
        <BondDiscountChart market={market} />
      </div>
      <div className="w-1/2">
        <BondPurchaseCard
          market={market}
          nativeCurrency={nativeCurrency}
          nativeCurrencyPrice={nativeCurrencyPrice}
          referralAddress={referralAddress}
          issuerName={protocol?.name || "BondProtocol"}
          provider={providers[market.chainId]}
          // @ts-ignore
          signer={signer}
        />
      </div>
    </div>
  );
};
