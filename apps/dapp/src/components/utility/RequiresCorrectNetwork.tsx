import { useAccount } from "wagmi";
import { Button } from "ui";
import { ConnectButton } from "../organisms/ConnectButton";

export type BondButtonProps = {
  showConnect: boolean;
  showNetworkSwitcher: boolean;
  ConnectComponent?: React.ReactNode;
  NetworkSwitcher?: React.ReactNode;
  onSwitchChain: () => void;
  network?: string;
  children: React.ReactNode;
  className?: string;
};

export const RequiresCorrectNetwork = (props: BondButtonProps) => {
  const { isConnected } = useAccount();

  if (!isConnected || props.showConnect) {
    return (
      props.ConnectComponent || (
        <div className={props.className}>
          <div className="flex w-full justify-center py-4">
            <ConnectButton />
          </div>
        </div>
      )
    );
  }

  if (props.showNetworkSwitcher) {
    return (
      <Button className={props.className} onClick={props.onSwitchChain}>
        Switch to {props.network}
      </Button>
    );
  }

  return <>{props.children}</>;
};
