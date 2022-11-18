import * as contractLibrary from "@bond-protocol/contract-library";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { FC, useEffect, useState } from "react";
import { Button } from "ui";
import { useAccount, useConnect, useSigner, useSwitchNetwork } from "wagmi";
import { providers } from "services/owned-providers";
import { ContractTransaction } from "ethers";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export type CloseMarketCardProps = {
  market: CalculatedMarket;
};

// @ts-ignore
export const CloseMarketCard: FC<CloseMarketCardProps> = (props) => {
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { switchNetwork } = useSwitchNetwork();

  const [correctChain, setCorrectChain] = useState<boolean>(false);

  useEffect(() => {
    void checkChain();
  }, [isConnected, signer]);

  const switchChain = (e: Event) => {
    e.preventDefault();
    const newChain = Number(
      "0x" + providers[props.market.network].network.chainId.toString()
    );
    switchNetwork?.(newChain);
  };

  async function checkChain() {
    const network = await signer?.provider?.getNetwork();
    setCorrectChain(
      (network && network.name === props.market.network) || false
    );
  }

  async function closeMarket() {
    const closeMarketTx: ContractTransaction =
      await contractLibrary.closeMarket(
        props.market.marketId,
        providers[props.market.network].network.chainId.toString(),
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
              Switch to {props.market.network}
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
