import type {FC} from "react";
import type {CalculatedMarket} from "@bond-labs/contract-library";
import {Route, Routes as Switch} from "react-router-dom";
import {useCalculatedMarkets} from "hooks";
import {CreateMarket, MarketInsights, Markets} from "components/pages";
import {IssuerPage} from "components/organisms";

export const RouteMap: FC = () => {
  const { allMarkets } = useCalculatedMarkets();
  const markets: CalculatedMarket[] = Array.from(allMarkets.values());

  return (
    <Switch>
      <Route path="/" element={<Markets markets={allMarkets} />} />
      <Route path="/markets" element={<Markets markets={allMarkets} />} />
      <Route path="/create" element={<CreateMarket />} />
      <Route path="/issuers/:name" element={<IssuerPage />} />
      <Route
        path="/market/:id"
        element={<MarketInsights markets={markets} />}
      />
    </Switch>
  );
};
