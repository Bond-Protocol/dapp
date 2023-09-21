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

  const auth = useAuth();

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
          <Button disabled={auth.isLoading} onClick={() => auth.signIn()}>
            {auth.isLoading ? "Confirm in your wallet" : "Sign in"}
          </Button>
        ) : (
          <ConnectButton />
        )}
      </div>
      <div className={auth.isLoading ? "opacity-100" : "opacity-0"}>
        <p className="mt-2 text-center text-xs text-light-grey-400">
          This action won't cost gas
        </p>
      </div>
    </div>
  );
};
