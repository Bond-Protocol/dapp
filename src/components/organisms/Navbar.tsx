import type {FC} from "react";
import {Link, Route, Routes as Switch} from "react-router-dom";
import {CreateMarketView} from "pages";
import {Button} from "..";
import {useAtom} from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import {useCalculatedMarkets} from "hooks";
import {MarketList} from "components/organisms/MarketList";
import {IssuerList} from "components/organisms/IssuerList";
import {MyBondsList} from "components/organisms/MyBondsList";
import {IssuerPage} from "./IssuerPage";

export const Routes: FC = () => {
  const {allMarkets, myMarkets, verifiedIssuers, unverifiedIssuers} = useCalculatedMarkets();

  return (
    <Switch>
      <Route index element={<MarketList markets={allMarkets} allowManagement={false}/>}/>
      <Route path="/markets" element={<MarketList markets={allMarkets} allowManagement={false}/>}/>
      <Route path="/my-markets" element={<MarketList markets={myMarkets} allowManagement={true}/>}/>
      <Route path="/issuers" element={<IssuerList/>}/>
      <Route path="/my-bonds" element={<MyBondsList/>}/>
      <Route path="/create-market" element={<CreateMarketView/>}/>
      {verifiedIssuers.map(issuer =>
        <Route key={issuer} path={"/issuers/" + issuer} element={<IssuerPage issuer={issuer}/>}/>
      )}
      {unverifiedIssuers.map(issuer =>
        <Route key={issuer} path={"/issuers/" + issuer} element={<IssuerPage issuer={issuer}/>}/>
      )}
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
      <Link to="/create-market">
        <Button>Create Market</Button>
      </Link>

      <div>
        <Button onClick={toggleTestnet}>{testnet ? "Testnet" : "Mainnet"}</Button>
      </div>
    </div>
  );
};
