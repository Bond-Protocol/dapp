import { useState } from "react";
import { Modal } from "../molecules/Modal";
import {
  TransactionHashDialog,
  TransactionHashDialogProps,
} from "./TransactionHashDialog";
import {
  PurchaseSuccessDialog,
  PurchaseSuccessDialogProps,
} from "./PurchaseSuccessDialog";
import {
  PurchaseConfirmDialog,
  PurchaseConfirmDialogProps,
} from "components/modals/index";
import { ContractTransaction } from "ethers";
import { useProvider } from "wagmi";
import { getBlockExplorer } from "../../utils/getBlockExplorer";
import { TransactionErrorDialog } from "components/modals/TransactionErrorDialog";
import { useNavigate } from "react-router-dom";

export type PurchaseBondModalProps = {
  open: boolean;
  onSubmit: () => Promise<ContractTransaction>;
  closeModal: () => void;
  network: string;
  issuer?: string;
  amount?: string;
} & Partial<
  PurchaseConfirmDialogProps &
    PurchaseSuccessDialogProps &
    TransactionHashDialogProps
>;

export const BondPurchaseModal = (props: PurchaseBondModalProps) => {
  const [index, setIndex] = useState(0);
  const [hash, setHash] = useState("");
  const [txError, setTxError] = useState<Error>();
  const { blockExplorerName, blockExplorerUrl } = getBlockExplorer(
    props.network,
    "tx"
  );
  const provider = useProvider();
  const navigate = useNavigate();

  const handleSubmit = async () => {
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
    navigate("/my-bonds");
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
    <TransactionErrorDialog key={3} error={txError} />,
  ];

  return (
    <Modal open={props.open} onClickClose={closeModal}>
      {dialogs[index]}
    </Modal>
  );
};
