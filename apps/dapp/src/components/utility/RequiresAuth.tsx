import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAuth } from "context/auth-provider";
import { Button } from "ui";
import { useAccount, useConnect } from "wagmi";
import { ConnectButton } from "..";

type RequiresAuthProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export const RequiresAuth = ({ children, ...props }: RequiresAuthProps) => {
  const { isConnected } = useAccount();
  //const { connectAsync, connect } = useConnect();
  const { openConnectModal } = useConnectModal();

  const auth = useAuth();

  const connectAndSign = async () => {
    console.log("conn");
    //const con = await openConnectModal();
    console.log({ con });
    const sign = await auth.signIn();

    console.log({ sign });
  };

  return auth.isAuthenticated ? (
    <>{children}</>
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="font-fraktion text-2xl font-semibold uppercase">
        {props.title}
      </p>
      {props.subtitle && <p>{props.subtitle}</p>}
      <div className="mt-4">
        {isConnected ? (
          <Button onClick={() => auth.signIn}>Sign In</Button>
        ) : (
          <ConnectButton />
        )}
      </div>
    </div>
  );
};
