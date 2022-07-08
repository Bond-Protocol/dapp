import { useAccount, useConnect, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useEffect } from 'react';

export const CreateMarketView = () => {
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
      <h1>Create Market</h1>
      <div>let's create a market</div>
    </div>
  );
};
