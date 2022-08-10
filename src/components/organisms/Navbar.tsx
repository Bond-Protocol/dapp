import type {FC} from "react";
import {Link, Route, Routes as Switch} from "react-router-dom";
import {CreateMarketView, Issuer, MarketsView} from "pages";
import {Button} from "..";
import {useAtom} from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import {useCalculatedMarkets} from "hooks";

export const Routes: FC = () => {
  const {verifiedIssuers, unverifiedIssuers} = useCalculatedMarkets();

  return (
    <Switch>
      <Route index element={<MarketsView/>}/>
      <Route path="/create-market" element={<CreateMarketView/>}/>
      <Route path="/markets" element={<MarketsView/>}/>
      {verifiedIssuers.map(issuer => <Route key={issuer} path={"/issuer/" + issuer} element={<Issuer issuer={issuer}/>}/>)}
      {unverifiedIssuers.map(issuer => <Route key={issuer} path={"/issuer/" + issuer} element={<Issuer issuer={issuer}/>}/>)}
    </Switch>
  );
};

export const Navbar: FC = () => {
  const [testnet, setTestnet] = useAtom(testnetMode);

  function toggleTestnet() {
    setTestnet(!testnet);
  }

  return (
    <div className="flex child:mx-1 justify-center py-4">
      <Link to="/markets">
        <Button>Markets</Button>
      </Link>

      <Link to="/create-market">
        <Button>Create Market</Button>
      </Link>

      <div>
        <Button onClick={toggleTestnet}>{testnet ? "Testnet" : "Mainnet"}</Button>
      </div>
    </div>
  );
};
