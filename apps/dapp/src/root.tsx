import React from "react";
import ReactDOM from "react-dom/client";
//App Entry Point
import { App } from "./App";
//Style Entry Point
import "ui/style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
