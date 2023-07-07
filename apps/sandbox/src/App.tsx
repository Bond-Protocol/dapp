import "./App.css";
import { EmbedMarket } from "./Iframe";

const tnetwork = "0x71e47a4429d35827e0312aa13162197c23287546";
const gmx = "0xea8a734db4c7ea50c32b5db8a0cb811707e8ace3";
const afx = "0x62A665d3f9fc9a968dC35a789122981d9109349a";

const gdex = "0xeca93e266b914700a26cf3fe364fad4134f8ba94";
function App() {
  return (
    <div className="main-container">
      <h1>Bond Sandbox</h1>
      <div
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          placeItems: "center",
          gap: "40px",
        }}
      >
        <div>
          <h2>Sigle Market - Width: 400</h2>
          <EmbedMarket width={820} />
        </div>
      </div>
    </div>
  );
}

export default App;
