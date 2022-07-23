import {FC} from "react";
import {HashRouter as Router} from "react-router-dom";
import {Navbar, Routes} from "components/organisms";
import {useCalculatedMarkets, useLoadApp, useMarkets, useTokens} from "./hooks";

export const App: FC = () => {
  const state = useLoadApp();
  const tokens = useTokens().tokens;
  const currentPrices = useTokens().currentPrices;
  const markets = useMarkets().markets;
  const calculatedMarkets = useCalculatedMarkets(currentPrices, markets).calculatedMarkets;

  return (
    <Router>
      <div className="text-brand-texas-rose bg-brand-covenant h-[100vh]">
        <Navbar/>
        <Routes/>
      </div>
    </Router>
  );
};
