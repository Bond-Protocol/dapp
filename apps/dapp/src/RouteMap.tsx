import type { FC } from "react";
import { useState } from "react";
import { Route, Routes as Switch } from "react-router-dom";
import {
  CreateMarket,
  Dashboard,
  MarketInsights,
  Markets,
  PolicyPage,
  TokenPage,
} from "./components";
import { cookiePolicy, privacyPolicy, terms } from "./content";
import { TokenList } from "components/lists/TokenList";

export const RouteMap: FC = () => {
  const [newMarket, setNewMarket] = useState<unknown>();

  return (
    <Switch>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/markets" element={<Markets />} />
      <Route path="/tokens" element={<TokenList />} />
      <Route path="/market/:chainId/:id" element={<MarketInsights />} />

      <Route
        path="/create"
        element={
          <CreateMarket onExecute={(marketData) => setNewMarket(marketData)} />
        }
      />

      <Route path="/tokens/:chainId/:address" element={<TokenPage />} />
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
