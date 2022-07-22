import React from "react";
import ReactDOM from "react-dom/client";

//App Entry Point
import {App} from "./App";

//Style Entry Point
import "./styles/index.css";
import {Providers} from "context/app-providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App/>
    </Providers>
  </React.StrictMode>
);
