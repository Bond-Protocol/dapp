import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "ui/style.css";

//App Entry Point
import { App } from "./App";
//Style Entry Point

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
