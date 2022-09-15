import type { FC } from "react";
import { Link, Route, Routes as Switch, useNavigate } from "react-router-dom";
import { Button } from "..";
import { useAtom } from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import { useCalculatedMarkets } from "../../hooks";
import { IssuerPage } from "./IssuerPage";
import logo from "../../assets/logo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MarketInsightsPage } from "./MarketInsightsPage";
import { Markets, CreateMarket } from "components/pages";

export const Routes: FC = () => {
  const { allMarkets } = useCalculatedMarkets();

  const mktArray = Array.from(allMarkets.values());

  return (
    <Switch>
      <Route path="/markets" element={<Markets markets={allMarkets} />} />
      <Route path="/create" element={<CreateMarket />} />
      <Route
        path="/market/:id"
        element={<MarketInsightsPage markets={mktArray} />}
      />
      <Route path="/issuers/:name" element={<IssuerPage />} />
    </Switch>
  );
};

export const Navbar: FC = () => {
  const [testnet, setTestnet] = useAtom(testnetMode);

  function toggleTestnet() {
    setTestnet(!testnet);
  }

  return (
    <div className="flex child:mx-1 justify-between px-[5vw] py-4" id="navbar">
      <img src={logo} className="w-[178px]" />
      <div className="flex h-min gap-6">
        <Link to="/markets">
          <Button>Markets</Button>
        </Link>
        <Link to="/create">
          <Button>Create Market</Button>
        </Link>
        <Button variant="secondary" onClick={toggleTestnet}>
          {testnet ? "Testnet" : "Mainnet"}
        </Button>
      </div>
      <ConnectButton />
    </div>
  );
};
