import { FC } from "react";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import {
  CHAINS,
  getProtocolByAddress,
  NativeCurrency,
} from "@bond-protocol/bond-library";
import { BondDiscountChart } from "components/organisms/BondDiscountChart";
import { useTokens } from "hooks";
import { providers } from "services/owned-providers";
import { useSigner } from "wagmi";
import { BondPurchaseCard } from "components/organisms";
import { useNativeCurreny } from "hooks/useNativeCurrency";

export type BondCardProps = {
  market: CalculatedMarket;
  className?: string;
};

const REFERRAL_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;
const NO_REFERRAL_ADDRESS = "0x0000000000000000000000000000000000000000";
const NO_FRONTEND_FEE_OWNERS = import.meta.env.VITE_NO_FRONTEND_FEE_OWNERS;

export const BondCard: FC<BondCardProps> = ({ market, ...props }) => {
  const protocol = getProtocolByAddress(market.owner, market.network);
  const { data: signer } = useSigner();

  const { nativeCurrency, nativeCurrencyPrice } = useNativeCurreny(
    market.network
  );

  const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
    market.network.concat("_").concat(market.owner)
  )
    ? NO_REFERRAL_ADDRESS
    : REFERRAL_ADDRESS;

  return (
    <div className={`flex gap-4 ${props.className}`}>
      <div className="w-1/2">
        <BondDiscountChart market={market} />
      </div>
      <div className="w-1/2">
        <BondPurchaseCard
          market={market}
          nativeCurrency={nativeCurrency}
          nativeCurrencyPrice={nativeCurrencyPrice}
          referralAddress={referralAddress}
          issuerName={protocol?.name || "BondProtocol"}
          provider={providers[market.network]}
          // @ts-ignore
          signer={signer}
        />
      </div>
    </div>
  );
};
