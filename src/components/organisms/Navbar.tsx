import type {FC} from "react";
import {Link, Route, Routes as Switch} from "react-router-dom";
import {CreateMarketView, MarketsView, NetworkView} from "pages";
import {Button} from "..";
import {useAtom} from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";

export const Routes: FC = () => {
  return (
    <Switch>
      <Route index element={<MarketsView/>}/>
      <Route path="/wallet" element={<NetworkView/>}/>
      <Route path="/create-market" element={<CreateMarketView/>}/>
      <Route path="/markets" element={<MarketsView/>}/>
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

      <Link to="/wallet">
        <Button>Network</Button>
      </Link>

      <div>
        <Button onClick={toggleTestnet}>{testnet ? "Testnet" : "Mainnet"}</Button>
      </div>
    </div>
  );
};
