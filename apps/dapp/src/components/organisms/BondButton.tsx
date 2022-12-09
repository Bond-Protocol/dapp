import { Button, Link } from "ui";
import { ConnectButton } from "components/common";

export type BondButtonProps = {
  showConnect: boolean;
  showSwitcher: boolean;
  showPurchaseLink: boolean;
  quoteTokenSymbol: string;
  purchaseLink: string;
  network: string;
  onSwitchChain: () => void;
  children: React.ReactNode;
};

export const BondButton = (props: BondButtonProps) => {
  if (props.showConnect)
    return (
      <div className="flex w-full justify-center py-4">
        <ConnectButton full />
      </div>
    );

  if (props.showSwitcher) {
    return (
      <Button className="mt-4 w-full" onClick={props.onSwitchChain}>
        Switch to {props.network}
      </Button>
    );
  }

  if (props.showPurchaseLink) {
    return (
      <Link
        className="color-black hover:color-black font-faketion mx-auto mt-4 flex w-full justify-center rounded-lg bg-light-secondary px-5 py-3 font-extrabold font-bold text-black hover:bg-white hover:text-black"
        href={props.purchaseLink}
        target="_blank"
        rel="noopener noreferrer"
        iconClassName="mb-0.5"
      >
        BUY {props.quoteTokenSymbol}
      </Link>
    );
  }

  return <>{props.children}</>;
};
