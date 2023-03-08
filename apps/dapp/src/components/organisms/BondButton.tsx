import { Button } from "ui";
import { ConnectButton } from "components/common";
import { ReactComponent as LinkIcon } from "ui/assets/icons/external-link.svg";
import { Tooltip } from "ui";
import { useEffect, useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { CHAINS } from "@bond-protocol/bond-library";

export type BondButtonProps = {
  showConnect: boolean;
  showPurchaseLink: boolean;
  quoteTokenSymbol: string;
  purchaseLink: string;
  chainId: string;
  children: React.ReactNode;
};

export const BondButton = (props: BondButtonProps) => {
  const [networkDisplayName, setNetworkDisplayName] = useState(
    CHAINS.get(props.chainId)?.displayName || props.chainId
  );

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const isCorrectNetwork = Number(props.chainId) === chain?.id;

  const switchChain = () => {
    switchNetwork?.(Number(props.chainId));
  };

  useEffect(() => {
    setNetworkDisplayName(
      CHAINS.get(props.chainId)?.displayName || props.chainId
    );
  }, [chain, props.chainId]);

  if (props.showConnect)
    return (
      <div className="flex w-full justify-center pt-4">
        <ConnectButton full />
      </div>
    );

  if (!isCorrectNetwork) {
    return (
      <Tooltip content="You need to switch to the correct network in order to bond">
        <Button className="mt-4 w-full" onClick={switchChain}>
          Switch to {networkDisplayName}
        </Button>
      </Tooltip>
    );
  }

  return (
    <div className="flex gap-2">
      {props.showPurchaseLink && (
        <a
          href={props.purchaseLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button
            thin
            variant="ghost"
            className="mt-4 flex w-full justify-center"
          >
            GET{" "}
            {props.quoteTokenSymbol.length > 6
              ? props.quoteTokenSymbol.split(" ")[1]
              : props.quoteTokenSymbol}
            <LinkIcon className={`color-inherit my-auto ml-1`} />
          </Button>
        </a>
      )}
      <div className="w-full">{props.children}</div>
    </div>
  );
};
