import * as contractLibrary from "@bond-protocol/contract-library";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { FC, useEffect, useState } from "react";
import { Button } from "ui";
import { useAccount, useSigner, useSwitchNetwork } from "wagmi";
import { providers } from "services/owned-providers";
import { ContractTransaction } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CHAINS } from "@bond-protocol/bond-library";

export type CloseMarketCardProps = {
  market: CalculatedMarket;
};

// @ts-ignore
export const CloseMarketCard: FC<CloseMarketCardProps> = (props) => {
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();

  const [correctChain, setCorrectChain] = useState<boolean>(false);
  const [chainName, setChainName] = useState("");

  useEffect(() => {
    void checkChain();
  }, [isConnected, signer]);

  const switchChain = (e: Event) => {
    e.preventDefault();
    switchNetwork?.(Number(props.market.chainId));
  };

  async function checkChain() {
    const network = await signer?.provider?.getNetwork();
    setCorrectChain(
      (network && network.chainId === Number(props.market.chainId)) || false
    );
    setChainName(CHAINS.get(props.market.chainId)?.displayName || "");
  }

  async function closeMarket() {
    const closeMarketTx: ContractTransaction =
      await contractLibrary.closeMarket(
        props.market.marketId,
        // @ts-ignore
        signer,
        {}
      );
  }

  return (
    props.market.isLive && (
      <div className="w-[80vw] px-2 pb-2">
        <div className="flex justify-center pt-2">
          {!isConnected && <ConnectButton />}

          {isConnected && !correctChain && (
            //@ts-ignore
            <Button className="" onClick={switchChain}>
              Switch to {chainName}
            </Button>
          )}

          {correctChain && (
            <Button className="" onClick={closeMarket}>
              Close Market
            </Button>
          )}
        </div>
      </div>
    )
  );
};
