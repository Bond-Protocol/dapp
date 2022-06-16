import { useEffect } from 'react';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const NetworkView = () => {
  const account = useAccount();
  const network = useNetwork();
  const { connect, isConnected } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>hello {account.data?.address}</h1>
      <div>
        <p>Connected to {network?.activeChain?.name}</p>
        <p>Network Id: {network?.activeChain?.id}</p>
      </div>
      <button onClick={() => connect()}>connec</button>
    </div>
  );
};
