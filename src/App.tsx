import { FC } from "react";
import { HashRouter as Router } from "react-router-dom";
import { Providers } from "context/app-providers";
import { Navbar } from "components/organisms";
import { Routes } from "pages/routes";
import { useLoadApp } from "./hooks";

export const App: FC = () => {
  const state = useLoadApp();

  return (
    <Providers>
      <Router>
        <div className="text-brand-texas-rose bg-brand-covenant h-[100vh]">
          <Navbar />
          <Routes />
        </div>
      </Router>
    </Providers>
  );
};
