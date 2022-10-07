import { Button, SummaryCard } from "components";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { providers } from "services/owned-providers";
import * as contractLibrary from "@bond-protocol/contract-library";
import { IssueMarketModal } from "../modals/IssueMarketModal";
import { useState } from "react";
import { IssueMarketMultisigModal } from "components/modals/IssueMarketMultisigModal";
import { useNavigate } from "react-router-dom";

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
    const newChain = Number(
      "0x" + providers[props.data.chain].network.chainId.toString()
    );
    switchNetwork?.(newChain);
  };

  const marketSummaryFields = [
    { label: "Capacity", value: props.data.summaryData.capacity },
    { label: "Payout Token", value: props.data.summaryData.payoutToken },
    { label: "Quote Token", value: props.data.summaryData.quoteToken },
    {
      label: "Estimated Bond Cadence",
      value: props.data.summaryData.estimatedBondCadence,
    },
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
      {
        gasPrice: 100,
        gasLimit: 10000000,
      }
    );
    navigate("/create/" + tx.hash);
    props.onExecute(props.data);
  };

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
        <p className="font-faketion font-bold tracking-widest mt-8">MARKET</p>

        <SummaryCard fields={marketSummaryFields} className="my-8" />

        <p className="font-faketion font-bold tracking-widest">VESTING TERMS</p>

        <SummaryCard fields={vestingSummaryFields} className="my-8" />

        {!isConnected ? (
          <Button
            onClick={openConnectModal}
            className="w-full font-faketion mt-5"
          >
            CONNECT WALLET
          </Button>
        ) : network.chain && network.chain.network == props.data.chain ? (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full font-faketion mt-5"
          >
            DEPLOY BOND USING WALLET
          </Button>
        ) : (
          // @ts-ignore
          <Button onClick={switchChain} className="w-full font-faketion mt-5">
            Switch Chain
          </Button>
        )}

        <Button
          type="submit"
          className="w-full font-faketion mt-5"
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

        <Button onClick={props.onEdit} className="w-full font-faketion mt-5">
          EDIT
        </Button>
      </div>
    </>
  );
};
