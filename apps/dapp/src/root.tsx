import React from "react";
import ReactDOM from "react-dom/client";

//Style Entry Point
import "./styles/index.css";
import "ui/src/style.css";

//App Entry Point
import { App } from "./App";
//import { DevApp } from "./DevApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
