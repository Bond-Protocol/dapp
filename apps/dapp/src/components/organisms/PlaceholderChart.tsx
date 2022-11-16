import { bondDiscountDataset, rugPull } from "../../utils/mock-data";
import { LineChart } from "components/organisms/LineChart";

export const PlaceholderChart = ({
  message,
  downBad,
}: {
  message?: string | React.ReactNode;
  downBad?: boolean;
}) => {
  return (
    <>
      <div className="relative h-full w-full">
        <div className="absolute top-[45%] h-[50%] w-full">
          <div className="text-center text-xs">{message}</div>
        </div>
        <div className="h-[99%] w-full blur-sm">
          <LineChart data={downBad ? rugPull : bondDiscountDataset} />
        </div>
      </div>
    </>
  );
};
