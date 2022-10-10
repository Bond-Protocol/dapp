import { Button } from "../atoms/Button";
import { ConnectButton } from "../organisms/ConnectButton";
import { Link } from "..";

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
      <div className="w-full flex justify-center py-4">
        <ConnectButton />
      </div>
    );

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
        className="mx-auto mt-4 rounded-lg px-5 py-3 font-extrabold w-full flex justify-center bg-brand-yella text-black color-black font-faketion font-bold hover:text-black hover:color-black hover:bg-white"
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
