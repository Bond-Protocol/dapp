import React from "react";
import ReactDOM from "react-dom/client";

//Style Entry Point
import "./styles/index.css";
import "ui/style.css";

//App Entry Point
import { App } from "./App";
//import { DevApp } from "./DevApp";
import { environment } from "./environment";

const enableMockAPI = async () => {
  if (!environment.enableMockAPI) return;

  const { worker } = await import("./mock/setup");
  return worker.start();
};

enableMockAPI().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
