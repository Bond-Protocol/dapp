import { Button } from "../atoms/Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "..";

export type BondButtonProps = {
  showConnect: boolean;
  showSwitcher: boolean;
  showPurchaseLink: boolean;
  quoteTokenSymbol: string;
  network: string;
  onSwitchChain: () => void;
  children: React.ReactNode;
};

export const BondButton = (props: BondButtonProps) => {
  if (props.showConnect) return <ConnectButton />;

  if (props.showSwitcher) {
    return (
      <Button className="w-full mt-4" onClick={props.onSwitchChain}>
        Switch to {props.network}
      </Button>
    );
  }

  if (props.showPurchaseLink) {
    return (
      <Link
        className="mx-auto mt-4 border rounded-lg px-5 py-3 w-full flex justify-center border-brand-yella"
        href="https://app.sushi.com/swap"
        target="_blank"
        rel="noopener noreferrer"
      >
        Buy {props.quoteTokenSymbol}
      </Link>
    );
  }

  return <>{props.children}</>;
};
