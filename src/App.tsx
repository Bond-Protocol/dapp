import {FC} from "react";
import {HashRouter as Router} from "react-router-dom";
import {Navbar, Routes} from "components/organisms";
import {useBondPrices, useLoadApp, useMarkets, useTokens} from "./hooks";

export const App: FC = () => {
  const state = useLoadApp();
  const tokens = useTokens().tokens;
  const currentPrices = useTokens().currentPrices;
  const markets = useMarkets().markets;
  const bondPrices = useBondPrices(currentPrices, markets).bondPrices;

  return (
    <Router>
      <div className="text-brand-texas-rose bg-brand-covenant h-[100vh]">
        <Navbar/>
        <Routes/>
      </div>
    </Router>
  );
};
