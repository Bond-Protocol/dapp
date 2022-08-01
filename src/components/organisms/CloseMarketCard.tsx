import * as contractLibrary from "@bond-labs/contract-library";
import {CalculatedMarket} from "@bond-labs/contract-library";
import * as React from "react";
import {FC, useEffect, useState} from "react";
import {Button} from "..";
import {useAccount, useConnect, useProvider, useSigner, useSwitchNetwork} from "wagmi";
import {providers} from "services/owned-providers";
import {ContractTransaction} from "ethers";
import {InjectedConnector} from "wagmi/connectors/injected";

export type CloseMarketCardProps = {
  market: CalculatedMarket
};

export const CloseMarketCard: FC<CloseMarketCardProps> = (props) => {
  const {data: signer} = useSigner();
  const {isConnected} = useAccount();
  const {connect} = useConnect({connector: new InjectedConnector()});
  const {switchNetwork} = useSwitchNetwork();

  const [correctChain, setCorrectChain] = useState<boolean>(false);

  useEffect(() => {
    void checkChain();
  }, [isConnected, signer]);

  const switchChain = (e: Event) => {
    e.preventDefault();
    const newChain = Number("0x" + providers[props.market.network].network.chainId.toString());
    switchNetwork?.(newChain);
  };

  async function checkChain() {
    const network = await signer?.provider?.getNetwork();
    setCorrectChain((network && network.name === props.market.network) || false);
  }

  async function closeMarket() {
    const closeMarketTx: ContractTransaction = await contractLibrary.closeMarket(
      props.market.marketId,
      providers[props.market.network].network.chainId.toString(),
      signer,
      {
        gasPrice: 100,
        gasLimit: 10000000,
      }
    );
  }

  return (
    props.market.isLive && <div className="px-2 pb-2 w-[90vw]">
      <div className="flex pt-2">
        {!isConnected &&
        //@ts-ignore
            <Button className="w-full" onClick={connect}>
                Connect Wallet
            </Button>
        }

        {isConnected && !correctChain &&
        //@ts-ignore
            <Button className="w-full" onClick={switchChain}>
                Switch to {props.market.network}
            </Button>
        }

        {correctChain &&
            <Button className="w-full" onClick={closeMarket}>
                Close Market
            </Button>
        }
      </div>
    </div>
  );
};
