import {ExpandableRow} from "components/molecules/ExpandableRow";
import {useMarkets, useTokens} from "hooks";
import {Market} from "src/generated/graphql";
import {useQueryClient} from "react-query";
import { CalculatedMarket } from "@bond-labs/contract-library";

export const MarketList = () => {
  const queryClient = useQueryClient();

  const tokens = useTokens().tokens;
  const currentPrices = useTokens().currentPrices;
  const markets = useMarkets().markets;
  const bondPrices: Map<string, CalculatedMarket> | undefined = queryClient.getQueryData("bondPrices");

  return (
    <>
      <table className="w-full text-left table-fixed">
        <thead>
          <tr>
            <th>Bond</th>
            <th>Payout Asset</th>
            <th>Discount</th>
            <th>TBV</th>
            <th>30D Perf.</th>
            <th>Created</th>
            <th>Expiry Date</th>
          </tr>
        </thead>

        <tbody>
          {markets.map((market: Market) => {
            return (
              <ExpandableRow key={market.id} expanded={<div/>}>
                <td>{market.quoteToken.symbol}</td>
                <td>{market.payoutToken.symbol}</td>
                <td>{bondPrices?.get(market.id)?.discount}%</td>
                <td>$ {0}</td>
                <td>{0}%</td>
                <td>{}</td>
                <td>{market.vesting}</td>
              </ExpandableRow>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
