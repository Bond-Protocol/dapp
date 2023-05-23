import type { FC } from "react";
import { Route, Routes as Switch } from "react-router-dom";
import {
  CreateMarket,
  CreateMarketV1,
  Dashboard,
  IssuerList,
  MarketInsights,
  Markets,
  MarketCreated,
  PolicyPage,
} from "./components";
import { useState } from "react";
import { terms, privacyPolicy, cookiePolicy } from "./content";
import { TokenList } from "components/lists/TokenList";

export const RouteMap: FC = () => {
  const [newMarket, setNewMarket] = useState<unknown>();

  return (
    <Switch>
      <Route path="/" element={<IssuerList />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/markets" element={<Markets />} />
      <Route path="/issuers" element={<IssuerList />} />
      <Route path="/tokens" element={<TokenList />} />
      <Route path="/market/:chainId/:id" element={<MarketInsights />} />

      <Route
        path="/create"
        element={
          <CreateMarket onExecute={(marketData) => setNewMarket(marketData)} />
        }
      />
      <Route
        path="/create/v1"
        element={
          <CreateMarketV1
            onExecute={(marketData) => setNewMarket(marketData)}
          />
        }
      />
      <Route
        path="/create/v1/:hash"
        element={<MarketCreated marketData={newMarket} />}
      />
    </Switch>
  );
};

export const PolicyRoutes = () => {
  return (
    <Switch>
      <Route path="/terms" element={<PolicyPage {...terms} />} />
      <Route path="/privacy" element={<PolicyPage {...privacyPolicy} />} />
      <Route path="/cookies" element={<PolicyPage {...cookiePolicy} />} />
    </Switch>
  );
};
