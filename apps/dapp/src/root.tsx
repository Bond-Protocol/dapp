import React from "react";
import ReactDOM from "react-dom/client";
import './polyfills';
//Style Entry Point
import "./styles/index.css";
import "ui/src/style.css";

//App Entry Point
import { App } from "./App";
//import { DevApp } from "./DevApp";
import { environment } from "./environment";

const enableMockAPI = async () => {
  if (!environment.enableMockAPI || environment.isProduction) return;

  const { worker } = await import("./mocks/browser");
  return worker.start();
};

enableMockAPI().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
