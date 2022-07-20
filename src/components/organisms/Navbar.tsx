import type { FC } from "react";
import { Link, Route, Routes as Switch } from "react-router-dom";
import { CreateMarketView, Home, NetworkView, MarketsView } from "pages";
import { Button } from "..";

export const Routes: FC = () => {
  return (
    <Switch>
      <Route index element={<Home />} />
      <Route path="/wallet" element={<NetworkView />} />
      <Route path="/create-market" element={<CreateMarketView />} />
      <Route path="/markets" element={<MarketsView />} />
    </Switch>
  );
};

export const Navbar: FC = () => {
  return (
    <div className="flex child:mx-1 justify-center py-4">
      <Link to="/">
        <Button>Home</Button>
      </Link>

      <Link to="/markets">
        <Button>Markets</Button>
      </Link>

      <Link to="/create-market">
        <Button>Create Market</Button>
      </Link>

      <Link to="/wallet">
        <Button>Network</Button>
      </Link>
    </div>
  );
};
