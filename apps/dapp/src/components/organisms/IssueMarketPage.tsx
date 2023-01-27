import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import * as contractLibrary from "@bond-protocol/contract-library";
import { Button, SummaryCard } from "ui";
import { providers } from "services/owned-providers";
import { IssueMarketModal } from "../modals/IssueMarketModal";
import { IssueMarketMultisigModal } from "components/modals/IssueMarketMultisigModal";
import {MarketOwnerAllowanceForm} from "components/common/MarketOwnerAllowanceForm";

export type IssueMarketPageProps = {
  onExecute: (marketData: any) => void;
  onEdit: () => void;
  data: any;
};

export const IssueMarketPage = (props: IssueMarketPageProps) => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultisigModalOpen, setIsMultisigModalOpen] = useState(false);
  const [txnBytecode, setTxnBytecode] = useState("");

  const switchChain = (e: Event) => {
    e.preventDefault();
    switchNetwork?.(providers[props.data.chain].network.chainId);
  };

  const marketSummaryFields = [
    { label: "Capacity", value: props.data.summaryData.capacity },
    { label: "Payout Token", value: props.data.summaryData.payoutToken },
    { label: "Quote Token", value: props.data.summaryData.quoteToken },
    /*
    {
      label: "Estimated Bond Cadence",
      value: props.data.summaryData.estimatedBondCadence,
    },
     */
    {
      label: "Minimum Exchange Rate",
      value: props.data.summaryData.minimumExchangeRate,
    },
  ];

  const vestingSummaryFields = [
    { label: "Conclusion", value: props.data.summaryData.conclusion },
    { label: "Vesting", value: props.data.summaryData.vesting },
    { label: "Bonds per week", value: props.data.summaryData.bondsPerWeek },
    { label: "Debt buffer", value: `${props.data.summaryData.debtBuffer}%` },
  ];

  const onConfirm = async () => {
    setIsModalOpen(false);

    props.data.isMultisig = false;

    const tx = await contractLibrary.createMarket(
      props.data.marketParams,
      props.data.bondType,
      props.data.chain,
      // @ts-ignore
      signer,
      { gasLimit: 1000000 }
    );
    navigate("/create/" + tx.hash);
    props.onExecute(props.data);
  };

  const selectedNetwork = network.chain?.id;

  return (
    <>
      <IssueMarketModal
        open={isModalOpen}
        onAccept={onConfirm}
        onReject={() => setIsModalOpen(false)}
      />
      <IssueMarketMultisigModal
        open={isMultisigModalOpen}
        txnBytecode={txnBytecode}
        chain={props.data.chain}
        address={
          contractLibrary.getAddressesForType(
            props.data.chain,
            props.data.bondType
          ).auctioneer
        }
        onAccept={(txHash: string) => {
          navigate("/create/" + txHash);
          props.onExecute(props.data);
        }}
        onReject={() => setIsMultisigModalOpen(false)}
      />
      <div className="mx-[15vw]">
        <p className="font-faketion mt-8 font-bold tracking-widest">MARKET</p>

        <SummaryCard fields={marketSummaryFields} className="my-8" />

        <p className="font-faketion font-bold tracking-widest">VESTING TERMS</p>

        <SummaryCard fields={vestingSummaryFields} className="my-8" />

        <MarketOwnerAllowanceForm marketData={props.data} />

        {!isConnected ? (
          <Button
            onClick={openConnectModal}
            className="font-faketion mt-5 w-full"
          >
            CONNECT WALLET
          </Button>
        ) : network.chain && selectedNetwork == props.data.chain ? (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="font-faketion mt-5 w-full"
          >
            DEPLOY BOND USING WALLET
          </Button>
        ) : (
          // @ts-ignore
          <Button onClick={switchChain} className="font-faketion mt-5 w-full">
            Switch Chain
          </Button>
        )}

        <Button
          type="submit"
          className="font-faketion mt-5 w-full"
          onClick={() => {
            setTxnBytecode(
              contractLibrary.createMarketMultisig(props.data.marketParams)
            );
            props.data.isMultisig = true;

            setIsMultisigModalOpen(true);
          }}
        >
          CONFIGURE FOR MULTI-SIG
        </Button>

        <Button onClick={props.onEdit} className="font-faketion mt-5 w-full">
          EDIT
        </Button>
      </div>
    </>
  );
};
