import type { FC } from "react";
import type { CalculatedMarket } from "@bond-protocol/contract-library";
import { Route, Routes as Switch } from "react-router-dom";
import { useMarkets } from "hooks";
import { CreateMarket, MarketInsights, Markets } from "components/pages";
import { IssuerPage } from "components/organisms";
import { MarketCreated } from "components/pages/MarketCreated";
import {useState} from "react";

export const RouteMap: FC = () => {
  const { allMarkets } = useMarkets();
  const markets: CalculatedMarket[] = Array.from(allMarkets.values());
  const [newMarket, setNewMarket] = useState<unknown>();

  return (
    <Switch>
      <Route path="/" element={<Markets markets={allMarkets} />} />
      <Route path="/markets" element={<Markets markets={allMarkets} />} />
      <Route path="/create" element={<CreateMarket onExecute={(marketData) => setNewMarket(marketData)} />} />
      <Route path="/issuers/:name" element={<IssuerPage />} />
      <Route
        path="/market/:id"
        element={<MarketInsights markets={markets} />}
      />
      <Route path="/create/:hash" element={<MarketCreated marketData={newMarket} />} />
    </Switch>
  );
};
