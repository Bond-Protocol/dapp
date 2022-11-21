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
    <div className="mt-10 flex flex-col">
      <h1 className="py-10 text-center font-faketion text-5xl leading-normal">
        CONNECT WALLET
        <br />
        TO CONTINUE
      </h1>
      <Button className="mx-auto w-[20vw]" onClick={openConnectModal}>
        Connect
      </Button>
    </div>
  );
};
