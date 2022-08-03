import {FC} from "react";
import {HashRouter as Router} from "react-router-dom";
import {Navbar, Routes} from "components/organisms";
import {useCalculatedMarkets, useMarkets, useTokens} from "./hooks";
import {useMyMarkets} from "hooks/useMyMarkets";

export const App: FC = () => {
  const currentPrices = useTokens().currentPrices;
  const {markets: allMarkets} = useMarkets();
  const {markets: myMarkets} = useMyMarkets();
  const allCalculatedMarkets = useCalculatedMarkets(currentPrices, allMarkets).allMarkets;
  const myCalculatedMarkets = useCalculatedMarkets(currentPrices, myMarkets).allMarkets;

  return (
    <Router>
      <div className="text-brand-texas-rose bg-brand-covenant h-[100vh]">
        <Navbar/>
        <Routes/>
      </div>
    </Router>
  );
};
