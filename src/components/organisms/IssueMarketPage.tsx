import {Button, SummaryCard} from "components";
import * as React from "react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useNetwork, useSigner, useSwitchNetwork} from "wagmi";
import {providers} from "services/owned-providers";
import * as contractLibrary from "@bond-labs/contract-library";

export type CreateMarketPageProps = {
  data: any;
  onExecute: (transaction: string) => void;
}

export const IssueMarketPage = (props: CreateMarketPageProps) => {
  const {isConnected} = useAccount();
  const {data: signer} = useSigner();
  const network = useNetwork();
  const {switchNetwork} = useSwitchNetwork();

  const switchChain = (e: Event) => {
    e.preventDefault();
    const newChain = Number(
      "0x" + providers[props.data.selectedChain].network.chainId.toString()
    );
    switchNetwork?.(newChain);
  };

  const marketSummaryFields = [
    {label: "Capacity", value: props.data.summaryData.capacity},
    {label: "Payout Token", value: props.data.summaryData.payoutToken},
    {label: "Quote Token", value: props.data.summaryData.quoteToken},
    {label: "Maximum Bond Size", value: props.data.summaryData.maximumBondSize},
    {label: "Estimated Bond Cadence", value: props.data.summaryData.estimatedBondCadence},
    {label: "Minimum Exchange Rate", value: props.data.summaryData.minimumExchangeRate},
  ];

  const vestingSummaryFields = [
    {label: "Conclusion", value: props.data.summaryData.conclusion},
    {label: "Vesting", value: props.data.summaryData.vesting},
    {label: "Bonds per week", value: props.data.summaryData.bondsPerWeek},
    {label: "Debt buffer", value: `${props.data.summaryData.debtBuffer}%`},
  ];

  const onConfirm = async () => {
    const tx = await contractLibrary.createMarket(
      props.data.marketParams,
      props.data.bondType,
      props.data.chain,
      // @ts-ignore
      signer,
      {
        gasPrice: 100,
        gasLimit: 10000000,
      }
    );
  }

  return (
    <div>
      <p className="font-faketion font-bold tracking-widest mt-8">
        MARKET
      </p>

      <SummaryCard fields={marketSummaryFields} className="my-8" />

      <p className="font-faketion font-bold tracking-widest">
        VESTING TERMS
      </p>

      <SummaryCard fields={vestingSummaryFields} className="my-8" />

      {!isConnected ? (
        <ConnectButton/>
      ) : network.chain && network.chain.network == props.data.chain ? (
        <Button onClick={onConfirm} className="w-full font-fraktion mt-5">
          DEPLOY BOND USING WALLET
        </Button>
      ) : (
        // @ts-ignore
        <Button onClick={switchChain} className="w-full font-fraktion mt-5">
          Switch Chain
        </Button>
      )}

      <Button type="submit" className="w-full font-fraktion mt-5">
        CONFIGURE FOR MULTI-SIG
      </Button>

      <Button type="submit" className="w-full font-fraktion mt-5">
        EDIT
      </Button>
    </div>
  )
}
