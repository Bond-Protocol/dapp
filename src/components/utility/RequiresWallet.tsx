import { ConnectButton } from "@rainbow-me/rainbowkit";

export type RequireWalletProps = {
  isConnected: boolean;
  children: React.ReactNode;
};

/**
 * Shows Connect Button when a wallet is not connected, renders children otherwise
 */
export const RequireWallet = (props: RequireWalletProps) => {
  return props.isConnected ? (
    props.children
  ) : (
    <div>
      <ConnectButton />
    </div>
  );
};
