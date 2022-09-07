import { useState } from "react";
import { Modal } from "../molecules/Modal";
import { TransactionHashDialog } from "../modals/TransactionHashDialog";
import { PurchaseSuccessDialog } from "../modals/PurchaseSuccessDialog";

export type PurchaseBondModalProps = {
  open: boolean;
  onSubmit: () => void;
  closeModal: () => void;
  issuer?: string;
  amount?: string;
};

export const BondPurchaseModal = (props: PurchaseBondModalProps) => {
  const [index, setIndex] = useState(0);

  return (
    <Modal open={props.open} onClickClose={props.closeModal}>
      <PurchaseSuccessDialog />
    </Modal>
  );
};
