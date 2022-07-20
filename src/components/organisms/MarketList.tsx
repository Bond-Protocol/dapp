import { ExpandableRow } from "components/molecules/ExpandableRow";
import { FC } from "react";
import { BondListCard, BondListCardProps } from "./BondListCard";

type MarketRow = {
  bond: string;
  payoutAsset: string;
  discount: string;
  tbv: string;
  performance: string;
  created: string;
  expiry: string;
  details: BondListCardProps;
};

type MarketListProps = {
  rows: Array<MarketRow>;
};

export const MarketList: FC<MarketListProps> = ({ rows }) => {
  return (
    <table className="w-full text-left table-fixed">
      <tr>
        <th>Bond</th>
        <th>Payout Asset</th>
        <th>Discount</th>
        <th>TBV</th>
        <th>30D Perf.</th>
        <th>Created</th>
        <th>Expiry Date</th>
      </tr>
      {rows.map((r, i) => (
        <ExpandableRow key={i} expanded={<BondListCard {...r.details} />}>
          <td>{r.bond}</td>
          <td>{r.payoutAsset}</td>
          <td>{r.discount}%</td>
          <td>$ {r.tbv}</td>
          <td>{r.performance}%</td>
          <td>{r.created}</td>
          <td>{r.expiry}</td>
        </ExpandableRow>
      ))}
    </table>
  );
};
