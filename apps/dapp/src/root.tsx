import React from "react";
import ReactDOM from "react-dom/client";

//Style Entry Point
import "./styles/index.css";
import "ui/style.css";

//App Entry Point
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
