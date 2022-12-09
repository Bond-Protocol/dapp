import { FC } from "react";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import {
  CHAINS,
  getProtocolByAddress,
  NativeCurrency,
} from "@bond-protocol/bond-library";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-icon.svg";
import { BondDiscountChart } from "components/organisms/BondDiscountChart";
import { useTokens } from "hooks";
import { providers } from "services/owned-providers";
import { useSigner } from "wagmi";
import { Button } from "ui";
import { BondDetails } from "components/organisms";
import { PlaceholderChart } from "components/organisms";

export type BondListCardProps = {
  market: CalculatedMarket;
  topRightLabel?: string;
  onClickTopRight: () => void;
  //TODO: (afx) remove this hack
  infoLabel?: boolean;
};

const REFERRAL_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;
const NO_REFERRAL_ADDRESS = "0x0000000000000000000000000000000000000000";
const NO_FRONTEND_FEE_OWNERS = import.meta.env.VITE_NO_FRONTEND_FEE_OWNERS;

export const BondListCard: FC<BondListCardProps> = ({ market, ...props }) => {
  const protocol = getProtocolByAddress(market.owner, market.network);
  const { data: signer } = useSigner();
  const { getPrice } = useTokens();

  const nativeCurrency: NativeCurrency = CHAINS.get(market.network)
    ?.nativeCurrency || {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  };

  const nativeCurrencyPrice = getPrice(nativeCurrency.symbol);

  const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
    market.network.concat("_").concat(market.owner)
  )
    ? NO_REFERRAL_ADDRESS
    : REFERRAL_ADDRESS;

  return (
    <div className="w-[100vw] max-w-[1440px] pb-8">
      <div className="my-5 flex justify-between pl-4">
        <div className="flex">
          {protocol?.logoUrl && (
            <img src={protocol.logoUrl} className="my-auto h-[52px] w-[52px]" />
          )}
          <p className="pl-1 font-faketion text-[48px]">
            {market.quoteToken?.symbol}
          </p>
        </div>
        <Button
          onClick={props.onClickTopRight}
          thin
          variant="ghost"
          className="my-auto text-[12px]"
        >
          <div className="flex fill-inherit pl-2">
            <div className="pt-[2px] font-faketion font-extrabold">
              {props.topRightLabel}
            </div>

            <ArrowIcon className="color-white color-white hover:color-brand-yella my-auto ml-2 rotate-90 fill-white" />
          </div>
        </Button>
      </div>
      <div className="mt-12 mb-6 flex gap-4 font-jakarta">
        <div className="flex w-1/2 flex-col justify-between ">
          {/*<BondDiscountChart market={market} />*/}

          <PlaceholderChart message={"Market Analytics under maintenance"} />
        </div>

        <div className="flex w-1/2 flex-col">
          <BondDetails
            market={market}
            nativeCurrency={nativeCurrency}
            nativeCurrencyPrice={nativeCurrencyPrice}
            referralAddress={referralAddress}
            issuerName={protocol?.name || "BondProtocol"}
            provider={
              providers[
                market.network === "arbitrum-one" ? "arbitrum" : market.network
              ]
            }
            // @ts-ignore
            signer={signer}
          />
        </div>
      </div>
    </div>
  );
};
