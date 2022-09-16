import React from "react";
import ReactDOM from "react-dom/client";
//App Entry Point
import { App } from "./App";
//Context Entry Point
import { Providers } from "context/app-providers";
//Style Entry Point
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
