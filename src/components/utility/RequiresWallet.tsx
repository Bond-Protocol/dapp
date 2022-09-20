import {ConnectButton} from "components/organisms/ConnectButton";
import {useAccount} from "wagmi";

export type RequireWalletProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Shows Connect Button when a wallet is not connected, renders children otherwise
 */
export const RequiresWallet = ({ className, children }: RequireWalletProps) => {
  const { isConnected } = useAccount();

  return isConnected ? (
    <>{children}</>
  ) : (
    <div className={`w-full flex justify-center text-center ${className}`}>
      <div className="p-8 bg-white/10 rounded-lg">
        <p className="text-xs">connect your wallet</p>
        <p className="text-xs mb-4">to continue</p>
        <ConnectButton />
      </div>
    </div>
  );
};
