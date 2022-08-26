import type { FC } from "react";
import { Link, Route, Routes as Switch } from "react-router-dom";
import { CreateMarketView } from "pages";
import { Button } from "..";
import { useAtom } from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import { useCalculatedMarkets } from "hooks";
import { MarketList } from "components/organisms/MarketList";
import { IssuerList } from "components/organisms/IssuerList";
import { MyBondsList } from "components/organisms/MyBondsList";
import { IssuerPage } from "./IssuerPage";
import { MyMarkets } from "components/organisms/MyMarkets";
import logo from "../../assets/logo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Routes: FC = () => {
  const { allMarkets, myMarkets, issuers } = useCalculatedMarkets();

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
      <Route path="/create-market" element={<CreateMarketView />} />
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

  function toggleTestnet() {
    setTestnet(!testnet);
  }

  return (
    <div className="flex child:mx-1 justify-between px-[5vw] py-4" id="navbar">
      <img src={logo} className="w-[178px]" />
      <div>
        <Link to="/create-market">
          <Button>Create Market</Button>
        </Link>

        <div>
          <Button onClick={toggleTestnet}>
            {testnet ? "Testnet" : "Mainnet"}
          </Button>
        </div>
      </div>
      <ConnectButton />
    </div>
  );
};
