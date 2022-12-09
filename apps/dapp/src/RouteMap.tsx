import type { FC } from "react";
import { Route, Routes as Switch } from "react-router-dom";
import {
  CreateMarket,
  Dashboard,
  IssuerPage,
  IssuerList,
  MarketInsights,
  Markets,
  MarketCreated,
  MyMarkets,
  PolicyPage,
} from "./components";
import { useState } from "react";
import { terms, privacyPolicy, cookiePolicy } from "./content";

export const RouteMap: FC = () => {
  const [newMarket, setNewMarket] = useState<unknown>();

  return (
    <Switch>
      <Route path="/" element={<IssuerList />} />
      <Route path="/markets" element={<Markets />} />
      <Route path="/issuers" element={<IssuerList />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-markets" element={<MyMarkets />} />
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
