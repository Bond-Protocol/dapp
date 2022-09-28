import type { FC } from "react";
import type { CalculatedMarket } from "@bond-protocol/contract-library";
import { Route, Routes as Switch } from "react-router-dom";
import { useMarkets } from "hooks";
import {
  CreateMarket,
  MarketInsights,
  Markets,
  MarketTabs,
} from "components/pages";
import {
  IssuerPage,
  IssuerList,
  MarketList,
  MyBondsList,
  MyMarkets,
} from "components/organisms";

export const RouteMap: FC = () => {
  const { isMarketOwner } = useMarkets();

  return (
    <Switch>
      <Route path="/" element={<MarketTabs />}>
        <Route index element={<MarketList />} />
        <Route path="/issuers" element={<IssuerList />} />
        <Route path="/my-bonds" element={<MyBondsList />} />
        {isMarketOwner && <Route path="/my-markets" element={<MyMarkets />} />}
      </Route>
      <Route path="/create" element={<CreateMarket />} />
      <Route path="/issuers/:name" element={<IssuerPage />} />
      <Route path="/market/:id" element={<MarketInsights />} />
    </Switch>
  );
};
