import { CalculatedMarket } from "types";
import { dateMath, formatDate, TooltipWrapper } from "ui";

export type MarketStatusChipProps = {
  market: CalculatedMarket;
  className?: string;
};
export const MarketStatusChip = ({ market }: MarketStatusChipProps) => {
  const now = new Date();
  const startDate = new Date(market.start! * 1000);
  const endDate = new Date(market.conclusion! * 1000);

  const isOpen = dateMath.isBefore(now, endDate);
  const isFuture = dateMath.isBefore(now, startDate);

  const formattedStartDate = formatDate.long(startDate);
  const formattedEndDate = formatDate.long(endDate);

  const tooltipContent = isFuture
    ? `Market starts on ${formattedStartDate}`
    : isOpen
    ? `Market ends on ${formattedEndDate}`
    : `Market closed on ${formattedEndDate}`;

  const style =
    isOpen || isFuture
      ? "border-light-success text-light-success"
      : "border-light-alert text-light-alert";

  return (
    <TooltipWrapper content={tooltipContent}>
      <div
        className={`rounded-full border bg-white/5 px-2 font-mono text-sm font-light uppercase ${style}`}
      >
        {isFuture ? "Coming soon" : isOpen ? "Open" : "Closed"}
      </div>
    </TooltipWrapper>
  );
};
