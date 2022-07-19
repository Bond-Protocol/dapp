import type { FC } from "react";
import { Route, Routes as Switch } from "react-router-dom";
import { CreateMarketView, Home, NetworkView, MarketsView } from "pages";

export const Routes: FC = () => {
  return (
    <Switch>
      <Route index element={<Home />} />
      <Route path="/wallet" element={<NetworkView />} />
      <Route path="/createMarket" element={<CreateMarketView />} />
      <Route path="/markets" element={<MarketsView />} />
    </Switch>
  );
};
