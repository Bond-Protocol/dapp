import { BondPriceChart } from "ui";
import { bondDiscountDataset, rugPull } from "../../utils/mock-data";

export const PlaceholderChart = ({
  message,
  downBad,
}: {
  message?: string | React.ReactNode;
  downBad?: boolean;
}) => {
  return (
    <>
      <div className="flex w-full flex-col">
        <div className="relative h-full w-full">
          <div className="absolute top-[45%] h-[50%] w-full">
            <div className="text-center text-xs">{message}</div>
          </div>
          <div className="h-[99%] w-full blur-sm">
            <BondPriceChart
              payoutTokenSymbol="ETH"
              data={downBad ? rugPull : bondDiscountDataset}
            />
          </div>
        </div>
      </div>
    </>
  );
};
