import {ExpandableRow} from "components/molecules/ExpandableRow";
import {useMarkets} from "hooks";
import {Market} from "src/generated/graphql";
import {useQueryClient} from "react-query";
import {CalculatedMarket} from "@bond-labs/contract-library";

export const MarketList = () => {
  const queryClient = useQueryClient();

  const markets = useMarkets().markets;
  const calculatedMarkets: Map<string, CalculatedMarket> | undefined = queryClient.getQueryData("calculatedMarkets");

  return (
    <>
      <table className="w-full text-left table-fixed">
        <thead>
          <tr>
            <th>Bond</th>
            <th>Payout Asset</th>
            <th>Price</th>
            <th>Discount</th>
            <th>TBV</th>
            <th>30D Perf.</th>
            <th>Expiry</th>
          </tr>
        </thead>

        <tbody>
          {markets.map((market: Market) => {
            const calculatedMarket = calculatedMarkets?.get(market.id);
            return (
              <ExpandableRow key={market.id} expanded={<div/>} className="gap-x-2">
                <td>{market.quoteToken.symbol}</td>
                <td>{market.payoutToken.symbol}</td>
                <td>
                  <p>{calculatedMarket?.formattedDiscountedPrice}</p>
                  <p className="text-xs">(Market: {calculatedMarket?.formattedFullPrice})</p>
                </td>
                <td>{calculatedMarket?.discount}%</td>
                <td>${0}</td>
                <td>{0}%</td>
                <td>{calculatedMarket?.formattedLongVesting}</td>
              </ExpandableRow>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
