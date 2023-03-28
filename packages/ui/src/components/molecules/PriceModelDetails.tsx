import { Input } from "..";
import { ReactComponent as DynamicPriceImage } from "../../assets/images/dynamic-price.svg";
import { ReactComponent as StaticPriceImage } from "../../assets/images/static-price.svg";
import { ReactComponent as DynamicOraclePriceImage } from "../../assets/images/dynamic-oracle-price.svg";
import { ReactComponent as StaticOraclePriceImage } from "../../assets/images/static-oracle-price.svg";
import { PriceType, PriceModel } from "reducers";

export type PriceModelDetailsProps = {
  type: PriceType;
  onOracleChange: (e: any) => void;
  className?: string;
  oracle?: boolean;
};

const options: Record<PriceModel, any> = {
  dynamic: {
    Image: DynamicPriceImage,
    title: "Dynamic Discount",
    description:
      "Bond Market are ... Lorem ipsum dolor sit amet consectetur. Facilisis consequat in ut massa quam ut.",
  },
  static: {
    Image: StaticPriceImage,
    title: "Fixed Discount",
    description:
      "Bond Market are ... Lorem ipsum dolor sit amet consectetur. Facilisis consequat in ut massa quam ut.",
  },
  ["oracle-dynamic"]: {
    oracle: true,
    Image: DynamicOraclePriceImage,
    title: "Dynamic Discount",
    description:
      "Bond Market are ... Lorem ipsum dolor sit amet consectetur. Facilisis consequat in ut massa quam ut.",
  },
  ["oracle-static"]: {
    oracle: true,
    Image: StaticOraclePriceImage,
    title: "Fixed Discount",
    description:
      "Bond Market are ... Lorem ipsum dolor sit amet consectetur. Facilisis consequat in ut massa quam ut.",
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
      className={`flex h-[160px] items-center justify-center bg-white/5 py-4 ${props.className}`}
    >
      <div className="w-min px-4">
        <option.Image className="stroke-white" />
      </div>
      <div className="w-[400px]">
        <div className="text-light-grey-400">
          <span className="mr-2 font-bold text-white">{option.title}</span>
          {option.description}
        </div>

        {option.oracle && (
          <Input
            label="Oracle Address"
            className="mt-2"
            onChange={(e) => props.onOracleChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};
