import { BondPriceChart } from "./BondPriceChart";
import { ReactComponent as ChartIcon } from "../../assets/icons/chart-large.svg";
import mockData from "./mock-chart-data";

export const PlaceholderChart = ({
  message,
  downBad,
}: {
  message?: string | React.ReactNode;
  downBad?: boolean;
}) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative h-full w-full">
        <div className="absolute flex h-full w-full flex-col items-center justify-center bg-white/5">
          <ChartIcon />
          <div className="mt-1 text-center text-lg">{message}</div>
        </div>
        <div className="h-[99%] w-full blur-md">
          <BondPriceChart
            disableTooltip
            payoutTokenSymbol="NGMI"
            data={mockData}
          />
        </div>
      </div>
    </div>
  );
};
