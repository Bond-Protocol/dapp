import { Button } from "ui";
import { ConnectButton } from "components/common";
import { ReactComponent as LinkIcon } from "../../assets/icons/external-link.svg";
import { Tooltip } from "ui";
import { useEffect, useState } from "react";
import { useNetwork, useSwitchNetwork} from "wagmi";
import { providers } from "services/owned-providers";
import { CHAINS } from "@bond-protocol/bond-library";

export type BondButtonProps = {
  showConnect: boolean;
  showPurchaseLink: boolean;
  quoteTokenSymbol: string;
  purchaseLink: string;
  network: string;
  children: React.ReactNode;
};

export const BondButton = (props: BondButtonProps) => {
  const [networkDisplayName, setNetworkDisplayName] = useState(
    CHAINS.get(props.network)?.displayName || props.network
  );

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const isMainnet = (chain?: string) => {
    return chain === "mainnet" || chain === "homestead";
  };

  const network =
    props?.network === "arbitrum-one"
      ? "arbitrum"
      : props?.network;

  const isCorrectNetwork =
    (isMainnet(props?.network) && isMainnet(chain?.network)) ||
    network === chain?.network;

  const switchChain = () => {
    switchNetwork?.(providers[network].network.chainId);
  };

  useEffect(() => {
    setNetworkDisplayName(CHAINS.get(props.network)?.displayName || props.network);
  }, [chain, props.network]);

  if (props.showConnect)
    return (
      <div className="flex w-full justify-center py-4">
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

  // if (props.showPurchaseLink) {
  //   return (
  //     <Link
  //       className="color-black hover:color-black mx-auto mt-4 flex w-full justify-center rounded-lg bg-light-secondary px-5 py-3 font-fraktion font-bold text-black hover:bg-white hover:text-black"
  //       href={props.purchaseLink}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       iconClassName="mb-0.5"
  //     >
  //       BUY {props.quoteTokenSymbol}
  //     </Link>
  //   );
  // }

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
