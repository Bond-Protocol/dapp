import { useState } from "react";
import { Modal } from "ui";
import {
  TransactionHashDialog,
  TransactionHashDialogProps,
  PurchaseSuccessDialog,
  PurchaseSuccessDialogProps,
  PurchaseConfirmDialog,
  PurchaseConfirmDialogProps,
  TransactionErrorDialog,
} from "ui";

import { ContractTransaction } from "ethers";
import { useNavigate } from "react-router-dom";
import { providers } from "services/owned-providers";
import { getBlockExplorer } from "@bond-protocol/contract-library";

export type PurchaseBondModalProps = {
  open: boolean;
  onSubmit: () => Promise<ContractTransaction>;
  closeModal: () => void;
  chainId: string;
  issuer?: string;
  amount?: string;
} & Partial<
  PurchaseConfirmDialogProps &
    PurchaseSuccessDialogProps &
    TransactionHashDialogProps
>;

const titles = [
  "Confirm Transaction",
  "Transaction Pending",
  "Successful Transaction!",
  "Failed Transaction",
];

export const BondPurchaseModal = (props: PurchaseBondModalProps) => {
  const [index, setIndex] = useState(0);
  const [hash, setHash] = useState("");
  const [txError, setTxError] = useState<Error>();
  const { blockExplorerName, blockExplorerUrl } = getBlockExplorer(
    props.chainId,
    "tx"
  );
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const provider = providers[props.chainId];
    try {
      const purchaseTx = await props.onSubmit();
      setIndex(1);
      setHash(purchaseTx.hash);
      const result = await provider.waitForTransaction(purchaseTx.hash);
      if (result.status === 0) {
        setIndex(3);
      } else {
        setIndex(2);
      }
    } catch (e) {
      setIndex(3);
      setTxError(e as Error);
    }
  };

  const closeModal = () => {
    props.closeModal();
    setIndex(0);
  };

  const goToMarkets = () => {
    closeModal();
    navigate("/markets");
  };

  const goToBondDetails = () => {
    closeModal();
    navigate("/dashboard");
  };

  const dialogs = [
    <PurchaseConfirmDialog
      key={0}
      onSubmit={handleSubmit}
      issuer={props.issuer}
      amount={props.amount}
      payout={props.payout}
      vestingTime={props.vestingTime}
      contract={props.contract}
      onCancel={props.closeModal}
    />,
    <TransactionHashDialog
      key={1}
      hash={hash}
      blockExplorerName={blockExplorerName}
      blockExplorerUrl={blockExplorerUrl}
    />,
    <PurchaseSuccessDialog
      key={2}
      issuer={props.issuer}
      goToMarkets={goToMarkets}
      goToBondDetails={goToBondDetails}
    />,
    <TransactionErrorDialog key={3} hash={hash} error={txError} />,
  ];

  return (
    <Modal title={titles[index]} open={props.open} onClickClose={closeModal}>
      {dialogs[index]}
    </Modal>
  );
};
