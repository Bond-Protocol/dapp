import { Button, Tooltip } from "ui";
import { ConnectButton } from "components/common";
import { ReactComponent as LinkIcon } from "ui/src/assets/icons/external-link.svg";
import { useEffect, useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { CHAINS } from "@bond-protocol/contract-library";

export type BondButtonProps = {
  showConnect: boolean;
  showPurchaseLink: boolean;
  quoteTokenSymbol: string;
  purchaseLink: string;
  chainId: string;
  children: React.ReactNode;
};

const tooltipContent = (
  <div className="p-4 text-left">
    <p className="font-bold">
      Note: This may not be the most efficient source of this token.
    </p>
    <p className="mt-2">
      This will link to LlamaSwap, an external meta-aggregator that queries
      exchange rates across 1inch, cowswap, matcha and others to find the best
      price.
    </p>

    <p className="mt-4">
      For LP tokens, you might want to create the LP position yourself in the
      corresponding DEX.
    </p>
  </div>
);

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
            <Tooltip
              className="max-w-sm"
              iconClassname="mr-2 fill-white text-white"
              content={tooltipContent}
            />
            GET{" "}
            {props.quoteTokenSymbol.length > 12
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
