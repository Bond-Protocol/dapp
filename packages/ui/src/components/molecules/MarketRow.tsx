import { TableCell } from "..";
type Market = {
  tbv: number;
};

export interface MarketRowProps {
  market: Market;
}

export const MarketRow = (props: MarketRowProps) => {
  return (
    <tr>
      <TableCell></TableCell>
    </tr>
  );
};
