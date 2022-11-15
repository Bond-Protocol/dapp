import {FC} from "react";
import {CalculatedMarket} from "@bond-protocol/contract-library";
import {getProtocolByAddress} from "@bond-protocol/bond-library";
import {ReactComponent as ArrowIcon} from "../../assets/icons/arrow-icon.svg";
import {Button} from "components/atoms";
import {BondDetails} from "components/molecules/BondDetails";
import {BondDiscountChart} from "components/organisms/BondDiscountChart";

export type BondListCardProps = {
  market: CalculatedMarket;
  topRightLabel?: string;
  onClickTopRight: () => void;
  //TODO: (afx) remove this hack
  infoLabel?: boolean;
};

export const BondListCard: FC<BondListCardProps> = ({market, ...props}) => {
  const protocol = getProtocolByAddress(market.owner, market.network);

  return (
    <div className="w-[100vw] max-w-[1440px] pb-8">
      <div className="my-5 flex justify-between pl-4">
        <div className="flex">
          {protocol?.logoUrl && (
            <img src={protocol.logoUrl} className="my-auto h-[52px] w-[52px]"/>
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

            <ArrowIcon className="color-white color-white hover:color-brand-yella my-auto ml-2 rotate-90 fill-white"/>
          </div>
        </Button>
      </div>
      <div className="mt-12 mb-6 flex gap-4 font-jakarta">
        <div className="flex w-1/2 flex-col justify-between ">
          <BondDiscountChart market={market} />
        </div>

        <div className="flex w-1/2 flex-col">
          <BondDetails market={market}/>
        </div>
      </div>
    </div>
  );
};
