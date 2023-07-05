import "./App.css";
import { Iframe } from "./Iframe";

function App() {
  return (
    <>
      <h1>Bond Sandbox</h1>
      <div className="card">
        <Iframe width={420} />

        <Iframe width={800} />
      </div>
    </>
  );
}

export default App;
