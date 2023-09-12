import type { FC } from "react";
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
import {
  EmbeddedMarkets,
  EmbeddedPurchaseCard,
  EmbeddedDashboard,
} from "components/modules/embed";
import { ApiTestElement } from "services/limit-order/api-test";

export const RouteMap: FC = () => {
  return (
    <>
      <Switch>
        <Route path="/" element={<TokenList />} />
        <Route path="/test-api" element={<ApiTestElement />} />{" "}
        <Route path="/dashboard" element={<Dashboard />} />{" "}
        <Route path="/markets" element={<Markets />} />
        <Route path="/tokens" element={<TokenList />} />
        <Route path="/market/:chainId/:id" element={<MarketInsights />} />
        <Route path="/create" element={<CreateMarket />} />
        <Route path="/tokens/:chainId/:address" element={<TokenPage />} />
      </Switch>
    </>
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

export const EmbedRoutes = () => {
  return (
    <Switch>
      <Route
        path="/embed/market/:chainId/:id"
        element={<EmbeddedPurchaseCard />}
      />
      <Route path="/embed/markets" element={<EmbeddedMarkets />} />
      <Route path="/embed/dashboard" element={<EmbeddedDashboard />} />
    </Switch>
  );
};
