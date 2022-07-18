import { useEffect } from "react";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export const NetworkView = () => {
  const { address, isConnected } = useAccount();
  const network = useNetwork();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>hello {address}</h1>
      <div>
        <p>Connected to {network?.chain?.name}</p>
        <p>Network Id: {network?.chain?.id}</p>
      </div>
      {!isConnected && <button onClick={() => connect()}>connec</button>}
    </div>
  );
};
