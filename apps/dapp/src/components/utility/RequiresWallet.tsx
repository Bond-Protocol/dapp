import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Button } from "ui";

export type RequireWalletProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Shows Connect Button when a wallet is not connected, renders children otherwise
 */
export const RequiresWallet = ({ className, children }: RequireWalletProps) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return isConnected ? (
    <>{children}</>
  ) : (
    <div className="mt-10 flex h-full flex-col">
      <h1 className="mt-24 text-center font-fraktion text-5xl leading-normal">
        CONNECT WALLET
        <br />
        TO CONTINUE
      </h1>
      <Button className="mx-auto mt-8 w-[18vw]" onClick={openConnectModal}>
        Connect
      </Button>
    </div>
  );
};
