import type { FC } from "react";
import { useState } from "react";
import { Link, Route, Routes as Switch, useNavigate } from "react-router-dom";
import { Button } from "..";
import { useAtom } from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import { useCalculatedMarkets } from "../../hooks";
import { MarketList } from "components/organisms/MarketList";
import { IssuerList } from "components/organisms/IssuerList";
import { MyBondsList } from "components/organisms/MyBondsList";
import { IssuerPage } from "./IssuerPage";
import { MyMarkets } from "components/organisms/MyMarkets";
import logo from "../../assets/logo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CreateMarketPage } from "components/organisms/CreateMarketPage";
import { IssueMarketPage } from "components/organisms/IssueMarketPage";
import createMarketMode from "../../atoms/createMarketMode.atom";
import { MarketInsightsPage } from "./MarketInsightsPage";
import { PROTOCOL_NAMES } from "@bond-labs/bond-library";

export const Routes: FC = () => {
  const navigate = useNavigate();
  const { allMarkets, myMarkets, issuers } = useCalculatedMarkets();
  const [marketData, setMarketData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  return (
    <Switch>
      <Route
        index
        element={<MarketList markets={allMarkets} allowManagement={false} />}
      />

      <Route
        path="/markets"
        element={<MarketList markets={allMarkets} allowManagement={false} />}
      />

      <Route path="/my-markets" element={<MyMarkets />} />

      <Route path="/issuers" element={<IssuerList />} />

      <Route path="/my-bonds" element={<MyBondsList />} />

      <Route
        path="/create/setup-market"
        element={
          <CreateMarketPage
            initialValues={initialValues}
            onConfirm={(marketData: any) => {
              setMarketData(marketData);
              setInitialValues(marketData.formValues);
              navigate("/create/issue-market");
            }}
          />
        }
      />

      <Route
        path="/create/issue-market"
        element={
          <IssueMarketPage
            data={marketData}
            onExecute={(txn) => console.log(txn)}
            onEdit={() => {
              navigate("/create/setup-market");
            }}
          />
        }
      />
      <Route
        path="/market/:id"
        element={
          <MarketInsightsPage markets={Array.from(allMarkets.values())} />
        }
      />

      {issuers.map((issuer) => (
        <Route
          key={issuer}
          path={"/issuers/" + issuer}
          element={<IssuerPage issuer={issuer} />}
        />
      ))}
    </Switch>
  );
};

export const Navbar: FC = () => {
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [createMarket, setCreateMarket] = useAtom(createMarketMode);

  function toggleTestnet() {
    setTestnet(!testnet);
  }

  return (
    <div className="flex child:mx-1 justify-between px-[5vw] py-4" id="navbar">
      <img src={logo} className="w-[178px]" />
      <div className="flex h-min gap-6">
        <Link to="/markets">
          <Button onClick={() => setCreateMarket(false)}>Markets</Button>
        </Link>
        <Link to="/create/setup-market">
          <Button onClick={() => setCreateMarket(true)}>Create Market</Button>
        </Link>
        <Button variant="secondary" onClick={toggleTestnet}>
          {testnet ? "Testnet" : "Mainnet"}
        </Button>
      </div>
      <ConnectButton />
    </div>
  );
};
