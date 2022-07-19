import type { FC } from "react";

type MarketRow = {
  bond: string;
  payoutAsset: string;
  discount: string;
  tbv: string;
  performance: string;
  created: string;
  expiry: string;
};

type MarketListProps = {
  rows: Array<MarketRow>;
};

export const MarketList: FC<MarketListProps> = ({ rows }) => {
  return (
    <table className="w-full text-left">
      <tr>
        <th>Bond</th>
        <th>Payout Asset</th>
        <th>Discount</th>
        <th>TBV</th>
        <th>30D Perf.</th>
        <th>Created</th>
        <th>Expiry Date</th>
      </tr>
      {rows.map((r) => (
        <tr>
          <td>{r.bond}</td>
          <td>{r.payoutAsset}</td>
          <td>{r.discount}%</td>
          <td>{r.tbv}</td>
          <td>{r.performance}%</td>
          <td>{r.created}</td>
          <td>{r.expiry}</td>
        </tr>
      ))}
    </table>
  );
};
