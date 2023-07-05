import "./App.css";
import { Iframe } from "./Iframe";

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
          <h2>Width: 420</h2>
          <Iframe width={420} />
        </div>

        <div>
          <h2>Width: 800</h2>
          <Iframe width={800} />
        </div>
      </div>
    </div>
  );
}

export default App;
