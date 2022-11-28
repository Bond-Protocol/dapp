import type { FC } from "react";
import { Route, Routes as Switch } from "react-router-dom";
import { useMarkets } from "hooks";
import { CreateMarket, MarketInsights, MarketCreated } from "components/pages";
import {
  IssuerPage,
  IssuerList,
  MarketList,
  MyBondsList,
  MyMarkets,
} from "components/organisms";
import { useState } from "react";
import { PolicyPage } from "components/pages/PolicyPage";
import { terms, privacyPolicy, cookiePolicy } from "./content";

export const RouteMap: FC = () => {
  const { isMarketOwner } = useMarkets();
  const [newMarket, setNewMarket] = useState<unknown>();

  return (
    <Switch>
      <Route path="/" element={<IssuerList />} />
      <Route path="/markets" element={<MarketList />} />
      <Route path="/issuers" element={<IssuerList />} />
      <Route path="/my-bonds" element={<MyBondsList />} />
      {isMarketOwner && <Route path="/my-markets" element={<MyMarkets />} />}
      <Route
        path="/create"
        element={
          <CreateMarket onExecute={(marketData) => setNewMarket(marketData)} />
        }
      />
      <Route
        path="/create/:hash"
        element={<MarketCreated marketData={newMarket} />}
      />
      <Route path="/issuers/:name" element={<IssuerPage />} />
      <Route path="/market/:network/:id" element={<MarketInsights />} />
    </Switch>
  );
};

export const PolicyRoutes = () => {
  return (
    <Switch>
      <Route path="/terms" element={<PolicyPage {...terms} />} />
      <Route path="/policy" element={<PolicyPage {...privacyPolicy} />} />
      <Route path="/cookies" element={<PolicyPage {...cookiePolicy} />} />
    </Switch>
  );
};
