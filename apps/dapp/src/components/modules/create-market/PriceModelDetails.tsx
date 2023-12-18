import { ReactComponent as DynamicPriceImage } from "assets/images/dynamic-price.svg";
import { ReactComponent as StaticPriceImage } from "assets/images/static-price.svg";
import { ReactComponent as DynamicOraclePriceImage } from "assets/images/dynamic-oracle-price.svg";
import { ReactComponent as StaticOraclePriceImage } from "assets/images/static-oracle-price.svg";
import { Input } from "ui";
import { PriceType, PriceModel } from "./create-market-reducer";

export type PriceModelDetailsProps = {
  type: PriceType;
  onOracleChange: (e: any) => void;
  className?: string;
  oracle?: boolean;
  oracleMessage: string;
  isOracleValid?: boolean;
};

const options: Record<PriceModel, any> = {
  dynamic: {
    Image: DynamicPriceImage,
    title: "Sequential Dutch Auctions",
    description: (
      <>
        enable protocols to issue tokens over time by controlling price and
        discount speed. Best for{" "}
        <span className="font-bold">short-term bonds</span>.
      </>
    ),
  },
  static: {
    Image: StaticPriceImage,
    title: "Fixed Price Bonds",
    description:
      "enable trial runs for limited quantity of vested tokens. Best for gauging demand for different vesting lengths.",
  },
  ["oracle-dynamic"]: {
    oracle: true,
    Image: DynamicOraclePriceImage,
    title: "Oracle SDAs",
    description:
      "track token price more closely and enable granular control over discount speed.",
  },
  ["oracle-static"]: {
    oracle: true,
    Image: StaticOraclePriceImage,
    title: "Fixed Discount Bonds",
    description:
      "enable protocols to issue tokens at a fixed discount from oracle price.",
  },
};

export const PriceModelDetails = ({
  type = "dynamic",
  ...props
}: PriceModelDetailsProps) => {
  const adjustedType: PriceModel = props.oracle ? `oracle-${type}` : type;
  const option = options[adjustedType];

  return (
    <div
      className={`flex h-[168px] items-center justify-center bg-white/5 px-3 py-4 ${props.className}`}
    >
      <div className="w-min px-3 pr-2">
        <option.Image className="stroke-white" />
      </div>
      <div className="w-[400px]">
        <div className="text-light-grey-400">
          <span className="mr-0.5 font-bold text-white">{option.title}</span>
          {option.description}
        </div>

        {option.oracle && (
          <Input
            label="Oracle Address"
            className="mt-2"
            subText={props.oracleMessage}
            subTextClassName={`${
              props.isOracleValid ? "text-green-500" : "text-red-500"
            }`}
            onChange={(e) => props.onOracleChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};
